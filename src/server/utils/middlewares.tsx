const fs = require('fs');
const multer = require('multer');
const Jimp = require('jimp');

import { getFileExtension, getFilePath } from './methods';
import { IMulterFile } from './types';
import { ImageSize } from '../../shared';

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

const storage = multer.diskStorage({
  destination: (req, file: IMulterFile, cb) => {
    const itemId = req.params.itemId;
    const uploadPath = `uploads/items/${itemId}`;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.split('.')[0] + Date.now() + getFileExtension(file.mimetype));
  },
});

export const uploadImages = multer({storage});

export const resizeImages = (req, res, next) => {

  const promises = [];
  const files = req.files;

  if (files && files.length) {
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

    return Promise.all(promises).then(() => next());

  } else {
    next();
  }
};
