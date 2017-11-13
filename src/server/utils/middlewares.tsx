const fs = require('fs');
const multer = require('multer');
import { getFileExtension } from './methods';

export const checkItemPhotosUploadPath = (req, res, next) => {

  const itemId = req.params.itemId;
  const uploadPath = `./uploads/items/${itemId}`;

  fs.exists(uploadPath, (exists) => {
     if (exists) {
       next();
     } else {
       fs.mkdir(uploadPath, (err) => {
         if (err) {
           console.log('Error in folder creation');
           next();
         }
         next();
       });
     }
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const itemId = req.params.itemId;
    const uploadPath = `./uploads/items/${itemId}`;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.slice(0, 4) + Date.now() + getFileExtension(file.mimetype));
  },
});

export const uploadImages = multer({storage});
