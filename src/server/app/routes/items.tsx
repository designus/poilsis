import { Router } from 'express';

import {
  auth,
  getEditItem,
  getViewItem,
  getAllItems,
  getCityItems,
  getUserItems,
  toggleItemIsEnabledField,
  toggleItemIsFavoriteField,
  addNewItem,
  deleteItem,
  updateItemDescription,
  updateMainInfo,
  updatePhotos,
  uploadPhotos
} from '../controllers';
import {
  createUploadPath,
  removeImagesFromFs,
  removeImagesDir
} from '../server-utils';

const router = Router();

router.route('/')
  .get(getAllItems)
  .post(auth.authenticate(), auth.authorize(['admin', 'user']), addNewItem);

router.route('/item/:itemId')
  .get(getEditItem)
  .delete(auth.authenticate(), auth.authorize(['admin', 'user']), removeImagesDir, deleteItem);

router.route('/view-item/:alias')
  .get(getViewItem);

router.route('/item/main-info/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), updateMainInfo);

router.route('/item/description/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), updateItemDescription);

router.route('/item/update-photos/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), removeImagesFromFs, updatePhotos);

router.route('/item/upload-photos/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), createUploadPath, uploadPhotos);

router.route('/city/:cityId')
  .get(getCityItems);

router.route('/user/:userId')
  .get(getUserItems);

router.route('/item/toggle-enabled/:itemId')
  .patch(auth.authenticate(), auth.authorize(['admin', 'user']), toggleItemIsEnabledField);

router.route('/item/toggle-favorite/:itemId')
  .patch(auth.authenticate(), auth.authorize(['admin']), toggleItemIsFavoriteField);

export default router;
