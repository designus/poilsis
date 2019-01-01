import { SheetsRegistry } from 'react-jss';
import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';
import { Response, NextFunction } from 'express';
import { exists, mkdir, readFile, writeFile, unlink, readdir, lstat } from 'fs';
import { promisify } from 'util';
import * as rimraf from 'rimraf';

import {
  ImageSize,
  IImage,
  IResponseError,
  mapMimeTypesToTypes,
  itemValidation,
} from 'global-utils';

import {
  MAX_PHOTO_COUNT,
  MAX_PHOTO_SIZE,
  WRONG_FILE_TYPE,
} from 'data-strings';

import { IMulterFile, FileUploadErrors } from './types';
import { getValidationMessage } from './validationMessages';

export const checkIfDirectoryExists = promisify(exists);
export const createDirectory = promisify(mkdir);
export const removeDirectory = promisify(rimraf);
export const readFileFromDisk = promisify(readFile);
export const writeFileToDisk = promisify(writeFile);
export const getDirectoryStatus = promisify(lstat);
export const readDirectoryContent = promisify(readdir);

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
      thumbName: `${name}_${ImageSize.Small}.${extension}`,
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

export const getMaterialUiCSSParams = () => {
  const sheetsRegistry = new SheetsRegistry();
  const theme = createMuiTheme();
  const generateClassName = createGenerateClassName();
  const sheetsManager = new Map();
  const materialCSS = sheetsRegistry.toString();

  return {sheetsRegistry, theme, generateClassName, sheetsManager, materialCSS};
};

export const preloadData = (data: Array<() => Promise<void>>, loadInitialDataOnly = false): Promise<any> => {
  const [loadInitialData, ...loadOtherData] = data;
  if (loadInitialDataOnly) {
    return loadInitialData();
  }
  return loadInitialData().then(() => Promise.all(loadOtherData.map(fn => fn())));
};

export const formatAlias = alias => alias
  .split(/\s+/)
  .join('-')
  .toLowerCase();

export const sendResponse = (res: Response, next: NextFunction) => (err, result) => {
  if (res.headersSent) return;

  if (err) {
    return next(err);
  }
  res.status(200).json(result);
};
