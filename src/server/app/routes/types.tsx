
import { Router } from 'express';
import { auth, getAllTypes, addNewType, updateType, deleteType } from '../controllers';

const router = Router();

router.route('/')
  .get(getAllTypes)
  .post(auth.authenticate(), auth.authorize(['admin']), addNewType);

router.route('/type/:typeId')
  .put(auth.authenticate(), auth.authorize(['admin']), updateType)
  .delete(auth.authenticate(), auth.authorize(['admin']), deleteType);

export default router;
