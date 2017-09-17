const express = require('express');
const router = express.Router();

import {CitiesModel} from '../model';

router.route('/')
  .get((req, res) => {
    CitiesModel.find((err, cities) => {
      if (err) {
        res.send(err);
      }
      res.json(cities);
    });
  });

module.exports = router;
