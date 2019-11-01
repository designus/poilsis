import { Router } from 'express';

import {
  auth,
  getEditItem,
  getViewItem,
  getAllItems,
  getCityItems,
  getRecommendedItems,
  getUserItems,
  toggleIsEnabledField,
  toggleItemIsRecommendedField,
  addNewItem,
  deleteItem,
  updateItemDescription,
  updateMainInfo,
  updatePhotos,
  uploadPhotos,
  doesAliasExist
} from '../controllers';
import {
  createUploadPath,
  removeImagesFromFs,
  removeImagesDir
} from '../server-utils';

import { ItemsModel } from '../model';

const router = Router();

router.route('/')
  .get(getAllItems)
  .post(auth.authenticate(), auth.authorize(['admin', 'user']), addNewItem);

router.route('/recommended')
  .get(getRecommendedItems);

router.route('/item/:itemId')
  .get(getEditItem)
  .delete(auth.authenticate(), auth.authorize(['admin', 'user']), removeImagesDir, deleteItem);

router.route('/view-item/:alias')
  .get(getViewItem);

router.route('/item/alias-exist')
  .post(doesAliasExist(ItemsModel));

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

router.route('/item/toggle-enabled')
  .patch(auth.authenticate(), auth.authorize(['admin', 'user']), toggleIsEnabledField(ItemsModel));

router.route('/item/toggle-recommended/:itemId')
  .patch(auth.authenticate(), auth.authorize(['admin']), toggleItemIsRecommendedField);

export default router;
