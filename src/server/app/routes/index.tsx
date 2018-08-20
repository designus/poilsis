import { Router } from 'express';
import citiesRouter from './cities';
import typesRouter from './types';
import itemsRouter from './items';
import usersRouter from './users';
import tokensRouter from './tokens';

export const apiRouter = () => {
  const router = Router();

  router.get('/', (req, res) => res.json({message: 'API initialized'}));
  router.use('/cities', citiesRouter);
  router.use('/types', typesRouter);
  router.use('/items', itemsRouter);
  router.use('/users', usersRouter);
  router.use('/tokens', tokensRouter);

  return router;
};
