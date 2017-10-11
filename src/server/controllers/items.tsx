const express = require('express');
const sanitize = require('mongo-sanitize');
const router = express.Router();

import {ItemsModel} from '../model';

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

    const name = sanitize(req.body.name);
    const city = sanitize(req.body.city);
    const alias = sanitize(req.body.alias) || name;
    const address = sanitize(req.body.address);
    const types = req.body.types;

    const newItem = {name, city, alias, types, address};

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
  .put((req, res) => {

    const name = sanitize(req.body.name);
    const city = sanitize(req.body.city);
    const alias = sanitize(req.body.alias) || name;
    const description = sanitize(req.body.description);
    const address = sanitize(req.body.address);
    const types = req.body.types;
    const updatedAt = new Date();

    const updatedItem = {name, city, alias, types, description, address, updatedAt};

    ItemsModel.findOneAndUpdate({ id: req.params.itemId }, { $set: updatedItem }, { new: true, runValidators: true }, function(err, item) {
      if (err) {
        res.send(err);
      }
      res.send(item);
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

router.route('/city/:cityId')
  .get((req, res) => {
    ItemsModel.find({city: req.params.cityId}, (err, items) => {
      if (err) {
        res.send(err);
      }
      res.json(items);
    });
  });

module.exports = router;
