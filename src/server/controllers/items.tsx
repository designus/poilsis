const express = require('express');
const sanitize = require('mongo-sanitize');
const router = express.Router();
const shortId = require('shortid');

import { createUploadPath, uploadImages, resizeImages, getImages, removeImagesFromFs } from '../server-utils';
import { ItemsModel } from '../model';
import { MAX_FILE_COUNT, IMainInfoFields } from '../../global-utils';
import { FILES_KEY } from '../../data-strings';

router.route('/')
  .get((req, res) => {
    ItemsModel.find((err, items) => {
      if (err) {
        res.send(err);
      }
      res.json(items);
    });
  })
  .post((req, res, next) => {

    const id = shortId.generate();
    const name = sanitize(req.body.name);
    const city = sanitize(req.body.city);
    const alias = sanitize(req.body.alias) || name;
    const address = sanitize(req.body.address);
    const types = req.body.types;

    const newItem = {id, name, city, alias, types, address};

    new ItemsModel(newItem).save((err, item) => {
      if (err) {
        return next(err);
      }
      res.json(item);
    });
  });

router.route('/item/:itemId')
  .get((req, res) => {
    ItemsModel.findOne({id: req.params.itemId}, (err, item) => {
      if (err) {
        res.send(err);
      }
      res.json(item);
    });
  })
  .delete((req, res) => {
    ItemsModel.findOneAndRemove({id: req.params.itemId}, (err, item, result) => {
      if (err) {
        res.send(err);
      }
      res.send(item);
    });
  });

router.route('/item/mainInfo/:itemId')
  .put((req, res, next) => {
    const item: IMainInfoFields = req.body;
    const name = sanitize(item.name);
    const city = sanitize(item.city);
    const alias = sanitize(item.alias) || name;
    const address = sanitize(item.address);
    const types = item.types;
    const updatedAt = new Date();

    const updatedItem = {name, city, alias, types, address, updatedAt};

    ItemsModel.findOneAndUpdate({ id: req.params.itemId }, { $set: updatedItem}, { new: true, runValidators: true }, (err, item) => {
      if (err) { return next(err); }
      res.send(item);
    });
  });

router.route('/item/photos/:itemId')
  .put(removeImagesFromFs, (req, res, next) => {
    ItemsModel.findOne({id: req.params.itemId}, (err, item) => {
      if (err) {
        // TODO: Rollback deleted files
        return next(err);
      }

      item.images = req.body.images;

      item.save((err, item) => {
        if (err) {
          // TODO: Rollback deleted files
          return next(err);
        }

        res.send(item.images);
      });
    });
  });

router.route('/item/upload-photos/:itemId')
  .put(createUploadPath, (req, res, next) => {
    const uploadPhotos = uploadImages.array(`${FILES_KEY}[]`, MAX_FILE_COUNT);

    uploadPhotos(req, res, (err) => {
      if (err) { return next(err); }

      resizeImages(req, res)
        .then(() => {
          console.log('Images is resized');
          const images = getImages(req.files);

          ItemsModel.findOne({id: req.params.itemId}, (err, item) => {
            if (err) {
              // TODO: Remove uploaded files
              return next(err);
            }

            item.images = [...(item.images || []), ...images];

            item.save((err, item) => {
              if (err) {
                // TODO: Remove uploaded files
                return next(err);
              }

              res.send(item.images);
            });
          });
        })
        .catch(err => {
          // TODO: Remove uploaded files
          console.log(err);
        });
  });

});

router.route('/city/:cityId')
  .get((req, res) => {
    ItemsModel.find({city: req.params.cityId}, (err, items) => {
      if (err) {
        res.send(err);
      }
      res.json(items);
    });
  });

export default router;
