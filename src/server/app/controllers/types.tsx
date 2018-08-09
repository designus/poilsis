
import { Request, Response, NextFunction, Router } from 'express';
import { ITypeFields } from 'global-utils';
import { TypesModel } from '../model';
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
    const alias = type.alias || type.name;
    const newType = { ...type, alias, id: shortId.generate() };

    new TypesModel(newType).save(genericCallback(res, next));
  });

router.route('/type/:typeId')
  .put(auth.authenticate(), auth.authorize(['admin']), (req: Request, res: Response, next: NextFunction) => {
    const type: ITypeFields = req.body;
    const typeId = req.params.typeId;

    TypesModel.findOneAndUpdate({ id: typeId },  { $set: type }, { new: true, runValidators: true },
      genericCallback(res, next),
    );
  })
  .delete(auth.authenticate(), auth.authorize(['admin']), (req: Request, res: Response, next: NextFunction) => {
    TypesModel.findOneAndRemove({ id: req.params.typeId }, genericCallback(res, next));
  });

export default router;
