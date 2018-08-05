
import { Request, Response, NextFunction, Router } from 'express';
import { TypesModel } from '../model';
import { ITypeFields } from 'global-utils';
import { genericCallback } from '../server-utils';
import auth from './auth';

const router = Router();
const shortId = require('shortid');

router.route('/')
  .get((req: Request, res: Response, next: NextFunction) => {
    TypesModel.find(genericCallback(res, next));
  })
  .post(auth.authenticate(), auth.authorize(['admin']), (req: Request, res: Response, next: NextFunction) => {
    const type: ITypeFields = req.body;
    const newType = { ...type, id: shortId.generate() };

    new TypesModel(newType).save(genericCallback(res, next));
  });

router.route('/type/:typeId')
  .put(auth.authenticate(), auth.authorize(['admin']), (req: Request, res: Response, next: NextFunction) => {
    const type: ITypeFields = req.body;
    const typeId = req.params.typeId;

    TypesModel.findOneAndUpdate({ id: typeId },  { $set: type }, { new: true, runValidators: true },
      genericCallback(res, next),
    );
  });

export default router;
