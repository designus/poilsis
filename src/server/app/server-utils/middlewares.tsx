import multer from 'multer';
import Jimp from 'jimp';
import { Request, NextFunction, Response } from 'express';
import { readdir } from 'fs';
import {
  ImageSize,
  itemValidation
} from 'global-utils';
import { Image } from 'data-models';

import { formatValue } from 'global-utils/methods';

import {
  LARGE_IMAGE_WIDTH,
  LARGE_IMAGE_HEIGHT,
  SMALL_IMAGE_WIDTH,
  SMALL_IMAGE_HEIGHT,
  IMAGE_EXTENSIONS
} from 'global-utils/constants';

import { MulterRequest, MulterFile } from './types';
import {
  getFileExtension,
  getFilePath,
  getUploadPath,
  getInfoFromFileName,
  getSourceFiles,
  removeFiles,
  getRemovableFiles
} from './methods';

import {
  removeDirectory,
  createDirectory,
  checkIfDirectoryExists,
  readDirectoryContent
} from './fileSystem';

const { maxPhotos, mimeTypes, minPhotoHeight, maxPhotoSizeBytes, minPhotoWidth } = itemValidation.images;

// TODO: Remove deprecated
export const createUploadPath_deprecated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemId = req.params.itemId;
    const uploadPath = getUploadPath(itemId, 'items');
    const exists = await checkIfDirectoryExists(uploadPath);
    if (exists) {
      next();
    } else {
      await createDirectory(uploadPath);
      next();
    }
  } catch (err) {
    return next(err);
  }
};

// TODO: Remove deprecated
export const removeImagesDir = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uploadPath = getUploadPath(req.params.itemId, 'items');
    await removeDirectory(uploadPath);
    const exists = await checkIfDirectoryExists(uploadPath);
    if (exists) {
      throw new Error ('Unable to remove image directory');
    } else {
      next();
    }
  } catch (err) {
    return next(err);
  }
};

export const removeImagesFromFs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemId = req.params.itemId;
    const images: Image[] = req.body.images;
    const uploadPath = getUploadPath(itemId, 'items');
    const files: string[] = await readDirectoryContent(getUploadPath(itemId, 'items'));

    if (!files) {
      throw new Error('Unable to read directory content');
    }

    const sourceFiles = getSourceFiles(files);

    if (images.length !== sourceFiles.length) {
      const removableFiles = getRemovableFiles(files, images, uploadPath);
      removeFiles(removableFiles, next);
    } else {
      next();
    }

  } catch (err) {
    return next(err);
  }
};

// TODO: Remove deprecated
export const fileFilter = (req: MulterRequest, file: MulterFile, cb: any) => {
  const itemId = req.params.itemId;

  if (Array.isArray(req.files) && !req.files.length) {
    cb({ code: 'No files given'}, false);
  }

  readdir(getUploadPath(itemId, 'items'), (err, files: string[]) => {
    const sourceFiles = getSourceFiles(files);
    if (sourceFiles.length >= maxPhotos) {
      cb(new Error(`Please upload no more than ${maxPhotos} photos`), false);
    } else if (mimeTypes.indexOf(file.mimetype) === -1) {
      cb(new Error(`Please upload a valid image: ${IMAGE_EXTENSIONS.join(',')}`), false);
    } else {
      cb(null, true);
    }
  });
};

// TODO: Remove deprecated
const storage = multer.diskStorage({
  // @ts-ignore
  destination: (req: MulterRequest, file: MulterFile, callback) => {
    callback(null, getUploadPath(req.params.itemId, 'items'));
  },
  filename: (req: MulterRequest, file: MulterFile, callback) => {
    const { name } = getInfoFromFileName(file.originalname);
    const fileName = formatValue(name);
    callback(null, fileName + Date.now() + getFileExtension(file.mimetype));
  }
});

// TODO: Remove deprecated
export const uploadImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxPhotoSizeBytes,
    files: maxPhotos
  }
});

// TODO: Remove deprecated
async function resizeVerticalImage(
  smallImage: Jimp,
  largeImage: Jimp,
  smallImagePath: string,
  largeImagePath: string,
  height: number
) {
  if (height < minPhotoHeight) {
    throw new Error(`Provided image height (${height}px) should be >= ${minPhotoHeight}px`);
  }

  await smallImage
    .scaleToFit(SMALL_IMAGE_WIDTH, SMALL_IMAGE_HEIGHT)
    .quality(80)
    .write(smallImagePath);

  if (height > LARGE_IMAGE_HEIGHT) {
    await largeImage
      .scaleToFit(LARGE_IMAGE_WIDTH, LARGE_IMAGE_HEIGHT)
      .quality(80)
      .write(largeImagePath);
  } else {
    await largeImage
      .quality(80)
      .write(largeImagePath);
  }
}
// TODO: Remove deprecated
async function resizeHorizontalImage(
  smallImage: Jimp,
  largeImage: Jimp,
  smallImagePath: string,
  largeImagePath: string,
  width: number
) {
  if (width < minPhotoWidth) {
    throw new Error(`Provided image width (${width}px) should be >= ${minPhotoWidth}px`);
  }

  await smallImage
    .cover(SMALL_IMAGE_WIDTH, SMALL_IMAGE_HEIGHT)
    .quality(80)
    .write(smallImagePath);

  if (width > LARGE_IMAGE_WIDTH) {
    await largeImage
      .scaleToFit(LARGE_IMAGE_WIDTH, LARGE_IMAGE_HEIGHT)
      .quality(80)
      .write(largeImagePath);
  } else {
    await largeImage
      .quality(80)
      .write(largeImagePath);
  }
}

// TODO: Remove deprecated
const resizeImage = (file: MulterFile) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, extension } = getInfoFromFileName(file.filename);
      const largeImage = await Jimp.read(file.path);
      const smallImage = await Jimp.read(file.path);
      const width = largeImage.getWidth();
      const height = largeImage.getHeight();
      const smallImagePath = getFilePath(file.destination, name, extension, ImageSize.Small);
      const largeImagePath = getFilePath(file.destination, name, extension, ImageSize.Large);

      if (height > width) {
        await resizeVerticalImage(smallImage, largeImage, smallImagePath, largeImagePath, height);
      } else {
        await resizeHorizontalImage(smallImage, largeImage, smallImagePath, largeImagePath, width);
      }

      resolve();

    } catch (err) {
      reject(err);
    }
  });
};

export const resizeImages = (req: MulterRequest, res: Response) => {
  const files = req.files;

  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(files)) {
        throw new Error('Uploaded files doesn\'t meet type or length criterias to be resized');
      }

      await Promise.all(files.map(resizeImage));
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

export const handleItemsErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
};
