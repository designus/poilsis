import multer from 'multer';
import Jimp from 'jimp';

import { Request, NextFunction, Response } from 'express';

import { readdir } from 'fs';
import {
  ImageSize,
  IImage,
  itemValidation
} from 'global-utils';

import { FileUploadErrors, MulterRequest, MulterFile } from './types';
import {
  getFileExtension,
  getFilePath,
  getUploadPath,
  handleFileUploadErrors,
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

const { images: { maxPhotos, maxPhotoSizeBytes, mimeTypes } } = itemValidation;

export const createUploadPath = (req, res, next) => {
  const itemId = req.params.itemId;
  const uploadPath = getUploadPath(itemId);
  checkIfDirectoryExists(uploadPath)
    .then(exists => {
      if (exists) {
        next();
      } else {
        createDirectory(uploadPath)
          .then(() => next())
          .catch(next);
      }
    })
    .catch(next);
};

export const removeImagesDir = (req, res, next) => {
  const uploadPath = getUploadPath(req.params.itemId);
  removeDirectory(uploadPath)
    .then(() => next())
    .catch(next);
};

export const removeImagesFromFs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemId = req.params.itemId;
    const images: IImage[] = req.body.images;
    const uploadPath = getUploadPath(itemId);
    const files: string[] = await readDirectoryContent(getUploadPath(itemId));

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

export const fileFilter = (req: MulterRequest, file: MulterFile, cb) => {
  const itemId = req.params.itemId;
  readdir(getUploadPath(itemId), (err, files: string[]) => {
    const sourceFiles = getSourceFiles(files);
    if (sourceFiles.length >= maxPhotos) {
      cb({code: FileUploadErrors.limitFileCount}, false);
    } else if (mimeTypes.indexOf(file.mimetype) === -1) {
      cb({code: FileUploadErrors.wrongFileType}, false);
    } else {
      cb(null, true);
    }
  });
};

const storage = multer.diskStorage({
  destination: (req: MulterRequest, file: MulterFile, callback) => {
    callback(null, getUploadPath(req.params.itemId));
  },
  filename: (req: MulterRequest, file: MulterFile, callback) => {
    const { name } = getInfoFromFileName(file.originalname);
    callback(null, name + Date.now() + getFileExtension(file.mimetype));
  }
});

export const uploadImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxPhotoSizeBytes,
    files: maxPhotos
  }
});

export const resizeImages = (req: MulterRequest, res: Response) => {

  const files = req.files;

  return new Promise((resolve, reject) => {
    if (Array.isArray(files) && files.length && !res.headersSent) {
      const promises = files.map(file => {
        return new Promise(async (resolve, reject) => {
          try {
            const { name, extension } = getInfoFromFileName(file.filename);
            const image = await Jimp.read(file.path);
            const width = image.getWidth();
            const height = image.getHeight();

            if (height > width) {
              await image
                .scaleToFit(280, 220)
                .quality(80)
                .write(getFilePath(file.destination, name, extension, ImageSize.Small));
            } else {
              await image
                .resize(280, 220)
                .quality(80)
                .write(getFilePath(file.destination, name, extension, ImageSize.Small));
            }

            resolve();

          } catch (err) {
            reject(err);
          }
        });
      });

      return Promise.all(promises)
        .then(() => resolve(true))
        .catch(err => reject(new Error('Image resize error')));
    } else {
      return reject(new Error('Uploaded files doesn\'t meet type or length criterias to be resized'));
    }
  });
};

export const handleItemsErrors = (err, req, res, next) => {
  if (req.route && req.route.path === '/item/upload-photos/:itemId') {
    handleFileUploadErrors(err, res);
  } else {
    res.status(500).send({ message: err.message });
  }
};
