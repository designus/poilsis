const express = require('express');
const sanitize = require('mongo-sanitize');
const router = express.Router();
const shortId = require('shortid');

import { createUploadPath, uploadImages, resizeImages, getImages, removeImagesFromFs, removeImagesDir } from '../server-utils';
import { ItemsModel } from '../model';
import { MAX_FILE_COUNT, IItemFields } from '../../../global-utils';
import auth from './auth';

router.route('/')
  .get((req, res, next) => {
    ItemsModel.find((err, items) => {
      if (err) {
        return next(err);
      }
      res.json(items);
    });
  })
  .post(auth.authenticate(), auth.authorize(['admin', 'user']), (req, res, next) => {

    const id = shortId.generate();
    const name = sanitize(req.body.name);
    const cityId = sanitize(req.body.cityId);
    const alias = sanitize(req.body.alias) || name;
    const address = sanitize(req.body.address);
    const types = req.body.types;
    const userId = req.body.userId;
    const newItem = {id, name, cityId, alias, types, address, userId};

    new ItemsModel(newItem).save((err, item) => {
      if (err) {
        return next(err);
      }
      res.json(item);
    });
  });

router.route('/item/:itemId')
  .get((req, res, next) => {
    ItemsModel.findOne({id: req.params.itemId}, (err, item) => {
      if (err) {
        return next(err);
      }
      res.json(item);
    });
  })
  .delete(auth.authenticate(), removeImagesDir, (req, res, next) => {
    ItemsModel.findOneAndRemove({id: req.params.itemId}, (err, item, result) => {
      if (err) {
        return next(err);
      }
      res.send(item);
    });
  });

router.route('/item/mainInfo/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), (req, res, next) => {
    const item: IItemFields = req.body;
    const name = sanitize(item.name);
    const cityId = sanitize(item.cityId);
    const alias = sanitize(item.alias) || name;
    const address = sanitize(item.address);
    const types = item.types;
    const updatedAt = new Date();
    const userId = item.userId;

    const updatedItem = {name, cityId, alias, types, address, updatedAt, userId};

    ItemsModel.findOneAndUpdate({ id: req.params.itemId }, { $set: updatedItem}, { new: true, runValidators: true }, (err, item) => {
      if (err) { return next(err); }
      res.send(item);
    });
  });

router.route('/item/photos/:itemId')
  .put(auth.authenticate(), removeImagesFromFs, (req, res, next) => {
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
  .put(auth.authenticate(), createUploadPath, (req, res, next) => {
    const uploadPhotos = uploadImages.array(`files[]`, MAX_FILE_COUNT);

    uploadPhotos(req, res, (err) => {
      if (err) { return next(err); }

      resizeImages(req, res)
        .then(() => {
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
    ItemsModel.find({cityId: req.params.cityId}, (err, items) => {
      if (err) {
        res.send(err);
      }
      res.json(items);
    });
  });

router.route('/user/:userId')
  .get((req, res) => {
    ItemsModel.find({userId: req.params.userId}, (err, items) => {
      if (err) {
        res.send(err);
      }
      res.json(items);
    });
  });

export default router;
