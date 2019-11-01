
import { Router } from 'express';
import {
  auth,
  getAllTypes,
  addNewType,
  updateType,
  deleteType,
  getType,
  doesTypeAliasExist,
  toggleIsEnabledField
} from '../controllers';

import { TypesModel } from '../model';

const router = Router();

router.route('/')
  .get(getAllTypes)
  .post(auth.authenticate(), auth.authorize(['admin']), addNewType);

router.route('/type/alias-exist')
  .post(doesTypeAliasExist);

router.route('/type/toggle-enabled')
  .patch(auth.authenticate(), auth.authorize(['admin', 'user']), toggleIsEnabledField(TypesModel));

router.route('/type/:typeId')
  .get(getType)
  .put(auth.authenticate(), auth.authorize(['admin']), updateType)
  .delete(auth.authenticate(), auth.authorize(['admin']), deleteType);

export default router;
