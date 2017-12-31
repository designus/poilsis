const fs = require('fs');

import { IMulterFile, FileUploadErrors } from './types';
import {
  ImageSize,
  IImage,
  IResponseError,
  mapMimeTypesToTypes,
  maxFileSize,
  maxFileCount,
  wrongFileType,
  MAX_FILE_SIZE_MB,
  MAX_FILE_COUNT,
  ALLOWED_MIME_TYPES,
} from '../../global-utils';

import { IMAGES_KEY } from '../../data-strings';

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

export const copySync = (src, dest, overwrite) => {
  if (overwrite && fs.existsSync(dest)) {
    fs.unlinkSync(dest);
  }
  const data = fs.readFileSync(src);
  fs.writeFileSync(dest, data);
};

export const createIfDoesntExist = dest => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
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
    let errorMsg;

    switch (err.code) {
      case FileUploadErrors.limitFileSize:
        errorMsg = maxFileSize(MAX_FILE_SIZE_MB)(IMAGES_KEY);
        break;
      case FileUploadErrors.limitFileCount:
        errorMsg = maxFileCount(MAX_FILE_COUNT)(IMAGES_KEY);
        break;
      case FileUploadErrors.wrongFileType:
        errorMsg = wrongFileType(mapMimeTypesToTypes(ALLOWED_MIME_TYPES))(IMAGES_KEY);
        break;
      default:
        errorMsg = '';
        break;
    }

    const error: IResponseError = errorMsg ? {errors: {[IMAGES_KEY]: {message: errorMsg}}} : err;

    response.send(error);

  }
};

export const getUploadPath = (itemId) => `uploads/items/${itemId}`;

export const getSourceFiles = (files) => files.filter(file => file.split('.')[0].substr(-2) !== '_' + ImageSize.Small);

export function removeFiles(files, next) {
  if (files.length === 0) {
    next();
  } else {
     const file = files.pop();
     fs.unlink(file, (err) => {
        if (err) {
          return next(err);
        } else {
          removeFiles(files, next);
        }
     });
  }
};

export function saveImageInfoToDatabase(dbModel, id, images, res, next) {
  dbModel.findOne({id}, (err, item) => {
    if (err) {
      // TODO: Remove uploaded files or rollback deleted files
      return next(err);
    }

    item.images = [...(item.images || []), ...images];

    item.save((err, item) => {
      if (err) {
        // TODO: Remove uploaded files or rollback deleted files
        return next(err);
      }

      res.send(item.images);
    });
  });
}