import { readdir } from 'fs';
import { MAX_FILE_COUNT, MAX_FILE_SIZE_B, ALLOWED_MIME_TYPES, ImageSize, IImage } from 'global-utils';

import { IMulterFile, FileUploadErrors } from './types';
import {
  getFileExtension,
  getFilePath,
  getUploadPath,
  handleFileUploadErrors,
  getSourceFiles,
  removeFiles,
  removeDirectory,
  createDirectory,
  checkIfDirectoryExists,
} from './methods';

const multer = require('multer');
const Jimp = require('jimp');

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

export const removeImagesFromFs = (req, res, next) => {
  const itemId = req.params.itemId;
  const images = req.body.images;
  const uploadPath = getUploadPath(itemId);
  readdir(getUploadPath(itemId), (err, files: string[]) => {
    const sourceFiles = getSourceFiles(files);
    if (err) {
      return next(err);
    } else if (images.length !== sourceFiles.length) {
      const removableFiles = files
        .filter(fileName => !images.find((image: IImage) => (image.fileName === fileName) || (image.thumbName === fileName)))
        .map(fileName => `${uploadPath}/${fileName}`);

      removeFiles(removableFiles, next);
    } else {
      next();
    }
  });
};

export const fileFilter = (req, file, cb) => {
  const itemId = req.params.itemId;
  readdir(getUploadPath(itemId), (err, files: string[]) => {
    const sourceFiles = getSourceFiles(files);
    if (sourceFiles.length >= MAX_FILE_COUNT) {
      cb({code: FileUploadErrors.limitFileCount}, false);
    } else if (ALLOWED_MIME_TYPES.indexOf(file.mimetype) === -1) {
      cb({code: FileUploadErrors.wrongFileType}, false);
    } else {
      cb(null, true);
    }
  });
};

const storage = multer.diskStorage({
  destination: (req, file: IMulterFile, cb) => {
    cb(null, getUploadPath(req.params.itemId));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.split('.')[0] + Date.now() + getFileExtension(file.mimetype));
  },
});

export const uploadImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_B,
    files: MAX_FILE_COUNT,
  },
});

export const resizeImages = (req, res) => {

  const files = req.files;

  return new Promise((resolve, reject) => {
    if (files && files.length && !res.headersSent) {
      const promises = files.map(file => {
        return new Promise((resolve, reject) => {
          Jimp
            .read(file.path)
            .then((image) => {
              const [name, extension] = file.filename.split('.');
              image
                .resize(240, 200)
                .quality(60)
                .write(getFilePath(file.destination, name, extension, ImageSize.Small), () => {
                  resolve();
                });
              })
            .catch(err => reject(err));
        });
      });
      return Promise.all(promises).then(() => resolve());
    } else {
      return reject();
    }
  });
};

export const handleItemsErrors = (err, req, res, next) => {
  if (req.route && req.route.path === '/item/upload-photos/:itemId') {
    handleFileUploadErrors(err, res);
  } else {
    res.send(err);
  }
};
