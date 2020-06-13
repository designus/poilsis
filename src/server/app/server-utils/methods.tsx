import { Request, Response, NextFunction } from 'express';
import { unlink } from 'fs';
import {
  ImageSize,
  IMAGE_EXTENSIONS,
  DataTypes,
  UserRoles,
  Locale,
  TranslatableFields,
  LANGUAGES
} from 'global-utils';
import { IsEnabled, TranslatableField, Item, Image } from 'data-models';
import { CityInput, MainInfoInput } from 'input-types';
import { auth } from '../controllers';
import { MulterFile, IInfoFromFileName, FieldsToSet, EntityPath } from './types';
import { readDirectoryContent, checkIfDirectoryExists, createDirectory } from './fileSystem';

export const getInfoFromFileName = (fileName: string): IInfoFromFileName => {
  try {
    const pattern = `(.+)\.(${IMAGE_EXTENSIONS.join('|')})`;
    const searchValue = new RegExp(pattern);
    const nameAndSize = fileName.replace(searchValue, '$1');
    const extension = fileName.replace(searchValue, '$2');
    const sizeMatch: any = nameAndSize.match(new RegExp(`_(?<size>${ImageSize.Small}|${ImageSize.Large})$`));
    const size = sizeMatch ? sizeMatch.groups.size : null;
    const name = size ? nameAndSize.slice(0, -2) : nameAndSize;
    return { name, size, extension };
  } catch (err) {
    throw new Error(err);
  }
};

// TODO: Remove depracated
export const getSourceFileName = (fileName: string) => {
  const { name, extension } = getInfoFromFileName(fileName);
  return `${name}.${extension}`;
};

// TODO: Remove deprecated
export const getFileExtension = (mimeType: string) => {
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

export const getImagePath = (image: Image) => `${image.path}/${image.thumbName}`;

// TODO: Remove deprecated
export const getFilePath = (destination: string, name: string, extension: string, size: ImageSize) => {
  return `${destination}/${name}_${size}.${extension}`;
};

// TODO: Remove_deprecated
export const getImages = (files: MulterFile[]): Image[] => {
  return files.map(({filename, destination}: MulterFile) => {
    const { name, extension } = getInfoFromFileName(filename);
    return {
      fileName: filename,
      path: destination,
      thumbName: `${name}_${ImageSize.Small}.${extension}`
    } as Image;
  });
};

export const getUploadPath = (id: string, type: EntityPath) =>
  `${process.env.NODE_ENV === 'test' ? 'testUploads' : 'uploads'}/${type}/${id}`;

// TODO: remove deprecated
export const getSourceFiles = (files: string[]) => {
  const sourceFiles = files.filter(fileName => fileName === getSourceFileName(fileName));
  return sourceFiles;
};

export function removeFiles(files: string[], next: NextFunction) {
  if (files.length === 0) {
    next();
  } else {
     const file = files.pop() as string;
     unlink(file, (err: any) => {
        if (err) {
          return next(err);
        } else {
          removeFiles(files, next);
        }
     });
  }
}

export const extendWithUploadPath = (uploadPath: string) => (fileName: string) => `${uploadPath}/${fileName}`;

// TODO: remove deprecated
export const getRemovableFiles = (existingFiles: string[], newImages: Image[], uploadPath: string): string[] => {
  return existingFiles
    .filter(fileName => !newImages.find((image: Image) => (image.fileName === fileName) || (image.thumbName === fileName)))
    .map(extendWithUploadPath(uploadPath));
};

// TODO: remove deprecated
export const getFilesToRemove = (existingFiles: string[], newFiles: MulterFile[], uploadPath: string): string[] => {
  return existingFiles
    .filter(fileName => {
      const sourceFileName = getSourceFileName(fileName);
      return newFiles.find(file => file.filename === sourceFileName);
    })
    .map(extendWithUploadPath(uploadPath));
};

// TODO: remove deprecated
export const removeUploadedFiles = async (files: MulterFile[], itemId: string, next: NextFunction) => {
  try {
    const uploadPath = getUploadPath(itemId, 'items');
    const currentFiles: string[] = await readDirectoryContent(uploadPath);
    const removableFiles = getFilesToRemove(currentFiles, files, uploadPath);

    removeFiles(removableFiles, next);

  } catch (err) {
    return next(err);
  }
};

export const preloadData = (data: Array<() => Promise<void>>): Promise<any> => {
  const [loadInitialData, ...loadOtherData] = data;
  return loadInitialData().then(() => Promise.all(loadOtherData.map(fn => fn())));
};

export const sendResponse = (res: Response, next: NextFunction) => (err: any, result: any) => {
  if (err) {
    return next(err);
  }

  res.status(200).json(result);
};

// TODO: remove deprecated
export const getAdjustedIsEnabledValue = (item: DataTypes, languages: Locale[]) => {
  const isEnabled = item.isEnabled as IsEnabled;
  const name = item.name as TranslatableField;

  return languages.reduce<IsEnabled>((acc, locale) => {
    const oldValue = isEnabled[locale];
    acc[locale] = name[locale] ? oldValue : false;
    return acc;
  }, {} as IsEnabled);
};

export const getFormattedIsEnabled = (item: CityInput | MainInfoInput, languages: Locale[] = LANGUAGES) => {
  const isEnabled = item.isEnabled;
  const name = item.name;

  return languages.reduce<IsEnabled>((acc, locale) => {
    const oldValue = isEnabled[locale];
    acc[locale] = name[locale] ? oldValue : false;
    return acc;
  }, {} as IsEnabled);
};

// TODO: remove deprecated
export const isApprovedByAdmin = (userRole: UserRoles, item: Item) =>
  userRole === UserRoles.admin ? item.isApprovedByAdmin : false;

export const hasAdminAproval = (req: Request, item: MainInfoInput): boolean =>
  auth.getAccessTokenClaims(req).userRole === UserRoles.admin ? Boolean(item.isApprovedByAdmin) : false;

// TODO: remove deprecated
export function getFieldsToUnset<T>(languages: Locale[], skipLocale: Locale, fields: Array<TranslatableFields<T>>): string[] {
  const languagesToUnset = languages.filter(lang => lang !== skipLocale);
  return fields
    .map(field => languagesToUnset.map(lang => `${field}.${lang}`))
    .reduce((acc: string[], val) => acc.concat(val), []);
}

// TODO: remove deprecated
export function getFieldsToSet<T>(locale: Locale, fields: Array<TranslatableFields<T>>): FieldsToSet {
  return fields.reduce((acc: any, field) => {
    const value = `$${field}.${locale}`;
    acc[field as string] = value;
    return acc;
  }, {});
}

// TODO: Remove deprecated
export const createUploadPath = async (name: string, type: EntityPath) => {
  const path = getUploadPath(name, type);
  const exists = await checkIfDirectoryExists(path);

  if (exists) {
    return path;
  }

  await createDirectory(path);

  return path;
};
