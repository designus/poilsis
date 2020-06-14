import { Router } from 'express';

import {
  auth,
  getClientItem,
  getAdminItem,
  getAllItems,
  getCityItems,
  getRecommendedItems,
  getUserItems,
  toggleEnabled,
  toggleItemRecommended,
  toggleItemApproved,
  addNewItem,
  deleteItem,
  updateItemDescription,
  updateMainInfo,
  updatePhotos,
  uploadPhotos,
  doesAliasExist,
  addMockedData,
  removeMockedData
} from '../controllers';
import {
  createUploadPath_deprecated,
  removeImagesFromFs,
  removeImagesDir
} from '../server-utils';

import { ItemsModel } from 'global-utils/data-models';

const router = Router();

router.route('/')
  .get(getAllItems)
  .post(auth.authenticate(), auth.authorize(['admin', 'user']), addNewItem);

router.route('/recommended')
  .get(getRecommendedItems);

router.route('/item/:itemId')
  .delete(auth.authenticate(), auth.authorize(['admin', 'user']), removeImagesDir, deleteItem);

router.route('/admin-item/:itemId')
  .get(getAdminItem);

router.route('/client-item/:alias')
  .get(getClientItem);

router.route('/item/alias-exist')
  .post(doesAliasExist(ItemsModel));

router.route('/item/main-info/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), updateMainInfo);

router.route('/item/description/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), updateItemDescription);

router.route('/item/update-photos/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), removeImagesFromFs, updatePhotos);

router.route('/item/upload-photos/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), createUploadPath_deprecated, uploadPhotos);

router.route('/city/:cityId')
  .get(getCityItems);

router.route('/user/:userId')
  .get(getUserItems);

router.route('/item/toggle-enabled')
  .patch(auth.authenticate(), auth.authorize(['admin', 'user']), toggleEnabled(ItemsModel));

router.route('/item/toggle-recommended')
  .patch(auth.authenticate(), auth.authorize(['admin']), toggleItemRecommended);

router.route('/item/toggle-approved')
  .patch(auth.authenticate(), auth.authorize(['admin']), toggleItemApproved);

router.route('/mocked-data')
  .post(auth.authenticate(), auth.authorize(['admin']), addMockedData)
  .delete(auth.authenticate(), auth.authorize(['admin']), removeMockedData);

export default router;
