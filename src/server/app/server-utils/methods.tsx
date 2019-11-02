import { Response, NextFunction } from 'express';
import { unlink } from 'fs';
import {
  ImageSize,
  IImage,
  IResponseError,
  mapMimeTypesToTypes,
  itemValidation,
  IItem,
  DataTypes,
  UserRoles
} from 'global-utils';

import { MAX_PHOTO_COUNT, MAX_PHOTO_SIZE, WRONG_FILE_TYPE } from 'data-strings';

import { IMulterFile, FileUploadErrors } from './types';
import { getValidationMessage } from './validationMessages';

export const getFileExtension = (mimeType) => {
  if (mimeType === 'image/jpeg') {
    return '.jpeg';
  } else if (mimeType === 'image/png') {
    return '.png';
  } else if (mimeType === 'image/gif') {
    return '.gif';
  } else {
    return '';
  }
};

export const getFilePath = (destination, name, extension, size: ImageSize) => {
  return `${destination}/${name}_${size}.${extension}`;
};

export const getImages = (files: IMulterFile[]): IImage[] => {
  return files.map(({filename, destination}: IMulterFile, index: number): IImage => {
    const [name, extension] = filename.split('.');
    return {
      fileName: filename,
      path: destination,
      thumbName: `${name}_${ImageSize.Small}.${extension}`
    };
  });
};

export const handleFileUploadErrors = (err, response) => {
  if (err && !response.headersSent) {
    const { images: { maxPhotos, maxPhotoSizeMegabytes, mimeTypes } } = itemValidation;
    let errorMsg;

    switch (err.code) {
      case FileUploadErrors.limitFileSize:
        errorMsg = getValidationMessage(MAX_PHOTO_SIZE, maxPhotoSizeMegabytes);
        break;
      case FileUploadErrors.limitFileCount:
        errorMsg = getValidationMessage(MAX_PHOTO_COUNT, maxPhotos);
        break;
      case FileUploadErrors.wrongFileType:
        errorMsg = getValidationMessage(WRONG_FILE_TYPE, mapMimeTypesToTypes(mimeTypes));
        break;
      default:
        errorMsg = '';
        break;
    }

    const error: IResponseError = errorMsg ? {errors: {images: {message: errorMsg}}} : err;

    response.send(error);

  }
};

export const getUploadPath = (itemId) =>  `${process.env.NODE_ENV === 'test' ? 'testUploads' : 'uploads'}/items/${itemId}`;

export const getSourceFiles = (files) => files.filter(file => file.split('.')[0].substr(-2) !== '_' + ImageSize.Small);

export function removeFiles(files, next) {
  if (files.length === 0) {
    next();
  } else {
     const file = files.pop();
     unlink(file, (err) => {
        if (err) {
          return next(err);
        } else {
          removeFiles(files, next);
        }
     });
  }
}

export const preloadData = (data: Array<() => Promise<void>>): Promise<any> => {
  const [loadInitialData, ...loadOtherData] = data;
  return loadInitialData().then(() => Promise.all(loadOtherData.map(fn => fn())));
};

export const sendResponse = (res: Response, next: NextFunction) => (err, result) => {
  if (err) {
    return next(err);
  }

  res.status(200).json(result);
};

export const getAdjustedIsEnabledValue = (item: DataTypes) => {
  return Object.keys(item.isEnabled).reduce((acc, key) => {
    const oldValue = item.isEnabled[key];
    acc[key] = item.name[key] ? oldValue : false;
    return acc;
  }, {});
};

export const isApprovedByAdmin = (userRole: UserRoles, item: IItem) =>
  userRole === UserRoles.admin ? item.isApprovedByAdmin : false;
