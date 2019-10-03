import { Response, NextFunction } from 'express';
import { unlink } from 'fs';
import {
  ImageSize,
  IImage,
  IResponseError,
  mapMimeTypesToTypes,
  itemValidation,
  TranslatableField,
  Languages,
  DataTypes,
  LANGUAGES
} from 'global-utils';

import { MAX_PHOTO_COUNT, MAX_PHOTO_SIZE, WRONG_FILE_TYPE } from 'data-strings';

import { IMulterFile, FileUploadErrors } from './types';
import { getValidationMessage } from './validationMessages';

const AsciiFolder = require('fold-to-ascii');

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

export const formatAlias = (alias: string): string =>
  AsciiFolder.foldReplacing(alias)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .join('-')
    .toLowerCase();

export const getAlias = (item: DataTypes, languages: string[], next?: NextFunction): TranslatableField | void => {
  try {
    const getNewAlias = (value: string, values: TranslatableField, locale: string) => {
      const existingValues = Object.keys(values)
        .filter(key => key !== locale)
        .map(key => values[key]);

      return existingValues.includes(value) ? `${value}-${locale}` : value;
    };

    const result = languages.reduce((acc, locale) => {
      const newAlias = item.alias && item.alias[locale]
        ? getNewAlias(item.alias[locale], item.alias, locale)
        : getNewAlias(item.name[locale], item.name, locale);

      acc[locale] = newAlias ? formatAlias(newAlias) : '';
      return acc;
    }, {});
    return result;
  } catch (err) {
    return next(err);
  }
};

export const extendAliasWithId = (newAlias: TranslatableField, id: string, existingAliases: string[]): TranslatableField => {
  return Object.entries(newAlias).reduce((acc, [locale, value]: [Languages, string]) => {
    acc[locale] = existingAliases.includes(value) ? `${value}-${id}` : value;
    return acc;
  }, {});
};

export const getItemsByAliasesQuery = (aliases: string[]) => {
  const query = LANGUAGES.map(locale => ({
    [`alias.${locale}`]: { $in: aliases }
  }));

  return {
    $or: query
  };
};

export function getExistingAliases<T extends DataTypes[]>(items: T, ownItemId?: string) {
  return items
    // we remove own item
    .filter(item => item.id !== ownItemId)
    .map(item => Object.values(item.alias))
    .reduce((acc: string[], val: string[]) => acc.concat(val), []);
}

export function getUniqueAlias<T extends DataTypes[]>(items: T, ownItemId: string, alias: TranslatableField): TranslatableField {
  const existingAliases = getExistingAliases(items, ownItemId);
  return existingAliases.length > 0
    ? extendAliasWithId(alias, ownItemId, existingAliases)
    : alias;
}

export const sendResponse = (res: Response, next: NextFunction) => (err, result) => {
  if (err) {
    return next(err);
  }

  res.status(200).json(result);
};
