const express = require('express');
const router = express.Router();

import {TypesModel} from '../model';

router.route('/')
	.get((req, res) => {
		TypesModel.find((err, types) => {
			if (err) {
				res.send(err);
			}
			res.json(types);
		});
	});


module.exports = router;
