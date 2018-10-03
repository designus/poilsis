import {
  auth,
  getItem,
  getAllItems,
  getCityItems,
  getUserItems,
  toggleItem,
  addNewItem,
  deleteItem,
  updateMainInfo,
  updatePhotos,
  uploadPhotos,
} from '../controllers';
import {
  createUploadPath,
  removeImagesFromFs,
  removeImagesDir,
} from '../server-utils';

const express = require('express');
const router = express.Router();

router.route('/')
  .get(getAllItems)
  .post(auth.authenticate(), auth.authorize(['admin', 'user']), addNewItem);

router.route('/item/:itemId')
  .get(getItem)
  .delete(auth.authenticate(), auth.authorize(['admin', 'user']), removeImagesDir, deleteItem);

router.route('/item/mainInfo/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), updateMainInfo);

router.route('/item/update-photos/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), removeImagesFromFs, updatePhotos);

router.route('/item/upload-photos/:itemId')
  .put(auth.authenticate(), auth.authorize(['admin', 'user']), createUploadPath, uploadPhotos);

router.route('/city/:cityId')
  .get(getCityItems);

router.route('/user/:userId')
  .get(getUserItems);

router.route('/item/toggle/:itemId')
  .patch(auth.authenticate(), auth.authorize(['admin', 'user']), toggleItem);

export default router;
