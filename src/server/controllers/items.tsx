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
		const types = req.body.types;

		const newItem = {name, city, alias, types};

		new ItemsModel(newItem).save((err, item) => {
			if (err) {
				res.send(err);
			}
			res.json(item);
		});
	});

router.route('/item/:itemId')
	.get((req, res) => {
		ItemsModel.find({id: req.params.itemId}, (err, item) => {
			if (err) {
				res.send(err);
			}
			res.json(item);
		});
	});

router.route('/city/:cityId')
	.get((req, res) => {
		ItemsModel.findOne({city: req.params.cityId}, (err, items) => {
			if (err) {
				res.send(err);
			}
			res.json(items);
		});
	});

module.exports = router;
