const express = require('express');
import citiesRouter from './cities';
import typesRouter from './types';
import itemsRouter from './items';
import {handleItemsErrors} from '../server-utils';

export function apiRouter() {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json({message: 'API initialized'});
  });

  router.use('/cities', citiesRouter);
  router.use('/types', typesRouter);
  router.use('/items', itemsRouter, handleItemsErrors);

  return router;
}
