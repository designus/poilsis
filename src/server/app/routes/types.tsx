
import { Router } from 'express';
import { TypesModel } from 'data-models';
import {
  auth,
  getAdminTypes,
  getClientTypes,
  addNewType,
  updateType,
  deleteType,
  getType,
  doesAliasExist,
  toggleEnabled
} from '../controllers';

const router = Router();

router.route('/')
  .post(auth.authenticate(), auth.authorize(['admin']), addNewType);

router.route('/admin-types')
  .get(getAdminTypes);

router.route('/client-types')
  .get(getClientTypes);

router.route('/type/alias-exist')
  .post(doesAliasExist(TypesModel));

router.route('/type/toggle-enabled')
  .patch(auth.authenticate(), auth.authorize(['admin', 'user']), toggleEnabled(TypesModel));

router.route('/type/:typeId')
  .get(getType)
  .put(auth.authenticate(), auth.authorize(['admin']), updateType)
  .delete(auth.authenticate(), auth.authorize(['admin']), deleteType);

export default router;
