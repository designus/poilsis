import axios from 'axios';

import {
  startLoading,
  endLoading,
  showToast,
  setUploadProgress,
  uploadError,
  uploadSuccess,
  receiveAdminItem,
} from 'actions';
import { stopLoading, handleApiResponse, handleApiErrors } from './utils';
import {
  IAlias,
  onUploadProgress,
  CONTENT_LOADER_ID,
  DIALOG_LOADER_ID,
  getFormDataFromFiles,
  setAcceptLanguageHeader,
 } from 'client-utils';
import { IItemsMap, IAppState, Toast, IItem } from 'reducers';
import {
  ITEM_UPDATE_SUCCESS,
  ITEM_UPDATE_ERROR,
  ITEM_CREATE_SUCCESS,
  ITEM_CREATE_ERROR,
  ITEM_DELETE_SUCCESS,
  ITEM_DELETE_ERROR,
  IMAGES_UPLOAD_ERROR,
  IMAGES_UPLOAD_SUCCESS,
  IMAGES_UPDATE_SUCCESS,
  IMAGES_UPDATE_ERROR,
  IMAGES_KEY,
} from 'data-strings';
import { IImage, IItemFields, TItemFields } from 'global-utils';

export const SELECT_ITEM = 'SELECT_ITEM';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const RECEIVE_IMAGES = 'RECEIVE_IMAGES';
export const TOGGLE_ITEM_VISIBILITY = 'TOGGLE_ITEM_VISIBILITY';
export const RECEIVE_CLIENT_ITEM = 'RECEIVE_CLIENT_ITEM';

export const selectItem = (itemId: string) => ({
  type: SELECT_ITEM,
  itemId,
});

export const receiveItems = (dataMap: IItemsMap, aliases: IAlias[], isAllLoaded: boolean) => ({
  type: RECEIVE_ITEMS,
  dataMap,
  aliases,
  isAllLoaded,
});

export const receiveClientItem = (item: IItem) => ({
  type: RECEIVE_CLIENT_ITEM,
  item,
});

export const removeItem = (item: IItem) => ({
  type: REMOVE_ITEM,
  item,
});

export const receiveImages = (id: string, images: IImage[]) => ({
  type: RECEIVE_IMAGES,
  id,
  images,
});

export const toggleItemVisibility = (itemId, isEnabled) => ({
  type: TOGGLE_ITEM_VISIBILITY,
  itemId,
  isEnabled,
});

export const getItem = (itemId: string) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`http://localhost:3000/api/items/item/${itemId}`)
    .then(handleApiResponse)
    .then(item => {
      dispatch(receiveClientItem(item));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};

export const uploadPhotos = (itemId: string, files: File[]) => (dispatch) => {
  return axios
    .put(`http://localhost:3000/api/items/item/upload-photos/${itemId}`, getFormDataFromFiles(files), {
      onUploadProgress: (e) => onUploadProgress(e, (loadedPercent) => dispatch(setUploadProgress(loadedPercent))),
    })
    .then(handleApiResponse)
    .then((images: IImage[]) => {
      dispatch(receiveImages(itemId, images));
      dispatch(setUploadProgress(100));
      dispatch(showToast(Toast.success, IMAGES_UPLOAD_SUCCESS));
      dispatch(uploadSuccess());
      return Promise.resolve(images);
    })
    .catch(err => {
      console.error(err);
      const errors = err[IMAGES_KEY];
      const message = errors && errors.message || IMAGES_UPLOAD_ERROR;
      dispatch(showToast(Toast.error, message));
      dispatch(uploadError());
      return Promise.reject(errors);
    });
};

export const updatePhotos = (itemId: string, images: IImage[]) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(`http://localhost:3000/api/items/item/update-photos/${itemId}`, {images})
    .then(handleApiResponse)
    .then((images: IImage[]) => {
      dispatch(receiveImages(itemId, images));
      dispatch(showToast(Toast.success, IMAGES_UPDATE_SUCCESS));
      dispatch(endLoading(CONTENT_LOADER_ID));
      return Promise.resolve();
    })
    .catch(err => {
      console.error(err);
      const errors = err[IMAGES_KEY];
      const message = errors && errors.message || IMAGES_UPDATE_ERROR;
      dispatch(showToast(Toast.error, message));
      dispatch(endLoading(CONTENT_LOADER_ID));
      return Promise.reject(errors);
    });
};

export const updateMainInfo = (adminItem: TItemFields) => dispatch => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(`http://localhost:3000/api/items/item/mainInfo/${adminItem.id}`, adminItem, setAcceptLanguageHeader())
    .then(handleApiResponse)
    .then((clientItem: IItemFields) => {
      dispatch(receiveClientItem(clientItem));
      dispatch(receiveAdminItem(adminItem.id, adminItem));
      dispatch(stopLoading(false, ITEM_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(clientItem);
    })
    .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const createItem = (adminItem: TItemFields) => dispatch => {

  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.post('http://localhost:3000/api/items', adminItem, setAcceptLanguageHeader())
    .then(handleApiResponse)
    .then((clientItem: IItemFields) => {
      dispatch(receiveClientItem(clientItem));
      dispatch(stopLoading(false, ITEM_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(clientItem);
    })
    .catch(handleApiErrors(ITEM_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const deleteItem = (itemId: string) => (dispatch) => {

  dispatch(startLoading(DIALOG_LOADER_ID));

  return axios.delete(`http://localhost:3000/api/items/item/${itemId}`)
    .then(handleApiResponse)
    .then(item => {
      dispatch(removeItem(item));
      dispatch(stopLoading(false, ITEM_DELETE_SUCCESS, CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors(ITEM_DELETE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const toggleItem = (itemId: string, isEnabled: boolean) => (dispatch, getState) => {
  const appState: IAppState = getState();
  const userId = appState.items.dataMap[itemId].userId;
  return axios.patch(`http://localhost:3000/api/items/item/toggle/${itemId}`, { userId, isEnabled })
    .then(handleApiResponse)
    .then(() => {
      dispatch(toggleItemVisibility(itemId, isEnabled));
    })
    .catch(err => console.error('Err', err));
};
