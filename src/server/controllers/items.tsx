const express = require('express');
const sanitize = require('mongo-sanitize');
const router = express.Router();
const shortId = require('shortid');

import { checkItemPhotosUploadPath, uploadImages, resizeImages, getImages } from '../utils';
import { ItemsModel } from '../model';

router.route('/')
  .get((req, res) => {
    ItemsModel.find((err, items) => {
      if (err) {
        res.send(err);
      }
      res.json(items);
    });
  })
  .post((req, res) => {

    const id = shortId.generate();
    const name = sanitize(req.body.name);
    const city = sanitize(req.body.city);
    const alias = sanitize(req.body.alias) || name;
    const address = sanitize(req.body.address);
    const types = req.body.types;

    const newItem = {id, name, city, alias, types, address};

    new ItemsModel(newItem).save((err, item) => {
      if (err) {
        res.send(err);
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
  })
  .put((req, res) => {

      const name = sanitize(req.body.name);
      const city = sanitize(req.body.city);
      const alias = sanitize(req.body.alias) || name;
      const description = sanitize(req.body.description);
      const address = sanitize(req.body.address);
      const types = req.body.types;
      const images = req.body.images;
      const updatedAt = new Date();

      const updatedItem = {name, city, alias, types, description, address, images, updatedAt};

      ItemsModel.findOneAndUpdate({ id: req.params.itemId }, { $set: updatedItem }, { new: true, runValidators: true }, (err, item) => {
        if (err) {
          res.send(err);
        }
        res.send(item);
      });
  });

router.route('/item/:itemId/photos')
  .put(checkItemPhotosUploadPath, uploadImages.array('files[]', 6), resizeImages, (req, res) => {
    console.log('Req body', req.body);
    console.log('Files', req.files);

    const images = getImages(req.files);

    ItemsModel.findOneAndUpdate({ id: req.params.itemId }, { $push: {images: { $each: images }}}, { new: true, upsert: true },
      (err, item) => {
        if (err) {
          res.send(err);
        }
        res.send(item.images);
    });

  })

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
