const fs = require('fs');

import { IMulterFile, FileUploadErrors } from './types';
import {
  ImageSize,
  IImage,
  IResponseError,
} from '../../shared';

import { maxFileSize, maxFileCount, wrongFileType } from '../../client/app/helpers/validation/errorMessages';
import { MAX_FILE_SIZE_MB, MAX_FILE_COUNT, ALLOWED_MIME_TYPES } from '../../client/app/helpers';
import { mapMimeTypesToTypes } from '../../shared';
import { IMAGES_KEY } from '../../client/app/data-strings';

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
  if (err) {
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
