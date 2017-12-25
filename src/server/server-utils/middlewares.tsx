const fs = require('fs');
const multer = require('multer');
const Jimp = require('jimp');

import { getFileExtension, getFilePath, getUploadPath, handleFileUploadErrors } from './methods';
import { IMulterFile, FileUploadErrors } from './types';
import { MAX_FILE_COUNT, MAX_FILE_SIZE_B, ALLOWED_MIME_TYPES, ImageSize } from '../../global-utils';

export const checkItemPhotosUploadPath = (req, res, next) => {

  const itemId = req.params.itemId;
  const uploadPath = `./uploads/items/${itemId}`;

  fs.exists(uploadPath, (exists) => {
     if (exists) {
       next();
     } else {
       fs.mkdir(uploadPath, (err) => {
         if (err) {
           console.log('Error in folder creation', err);
           next();
         }
         next();
       });
     }
  });
};

export const fileFilter = (req, file, cb) => {
  const itemId = req.params.itemId;
  fs.readdir(getUploadPath(itemId), (err, files) => {
    const originalFiles = files.filter(file => file.split('.')[0].substr(-2) !== '_' + ImageSize.Small);
    if (originalFiles.length >= MAX_FILE_COUNT) {
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

  const promises = [];
  const files = req.files;

  return new Promise((resolve, reject) => {
    if (files && files.length && !res.headersSent) {
      files.forEach((file) => {
        Jimp
          .read(file.path)
          .then((image) => {
            const [name, extension] = file.filename.split('.');
            const thumb = new Promise((resolve, reject) => {
              image
                .resize(240, 200)
                .quality(60)
                .write(getFilePath(file.destination, name, extension, ImageSize.Small), () => resolve());
            });
            promises.push(thumb);
          })
          .catch(err => console.error(err));
      });
      return Promise.all(promises).then(() => resolve());
    } else {
      return reject();
    }
  });
};

export const handleItemsErrors = (err, req, res, next) => {
  if (req.route.path === '/item/:itemId/photos') {
    handleFileUploadErrors(err, res);
  } else {
    return next(err);
  }
}