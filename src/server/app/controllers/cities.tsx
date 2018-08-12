import { Request, Response, NextFunction, Router } from 'express';
import { ICityFields } from 'global-utils';
import { sendResponse } from '../server-utils';
import auth from './auth';

import { CitiesModel } from '../model';

const router = Router();

router.route('/')
  .get((req: Request, res: Response, next: NextFunction) => {
    CitiesModel.find(sendResponse(res, next));
  })
  .post(auth.authenticate(), auth.authorize(['admin']), (req: Request, res: Response, next: NextFunction) => {
    const city: ICityFields = req.body;
    const alias = city.alias || city.name;
    const newCity = { ...city, alias };

    new CitiesModel(newCity).save(sendResponse(res, next));
  });

router.route('/city/:cityId')
  .put(auth.authenticate(), auth.authorize(['admin']), (req: Request, res: Response, next: NextFunction) => {
    const city: ICityFields = req.body;
    const cityId = req.params.cityId;

    CitiesModel.findOneAndUpdate({ id: cityId },  { $set: city }, { new: true, runValidators: true },
      sendResponse(res, next),
    );
  })
  .delete(auth.authenticate(), auth.authorize(['admin']), (req: Request, res: Response, next: NextFunction) => {
    CitiesModel.findOneAndRemove({ id: req.params.cityId }, sendResponse(res, next));
  });

export default router;
