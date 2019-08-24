import axios from 'axios';

import {
  setUploadProgress,
  uploadError,
  uploadSuccess
} from 'actions/upload';

import { showToast } from 'actions/toast';
import { startLoading, endLoading } from 'actions/loader';
import { stopLoading, handleApiResponse, handleApiErrors } from './utils';
import { onUploadProgress, getFormDataFromFiles, getNormalizedData } from 'client-utils/methods';
import { IAlias } from 'client-utils/types';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
import { IItemsMap, IAppState, Toast } from 'reducers';
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
  IMAGES_UPDATE_ERROR
} from 'data-strings';
import { IImage, IItem, IItemDescFields } from 'global-utils/typings';
import { getItemById } from 'selectors';
import { config } from '../../../../config';

export const SELECT_ITEM = 'SELECT_ITEM';
export const CLEAR_SELECTED_ITEM = 'CLEAR_SELECTED_ITEM';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const RECEIVE_IMAGES = 'RECEIVE_IMAGES';
export const TOGGLE_ITEM_ENABLED = 'TOGGLE_ITEM_ENABLED';
export const TOGGLE_ITEM_RECOMMENDED = 'TOGGLE_ITEM_RECOMMENDED';
export const RECEIVE_ITEM = 'RECEIVE_ITEM';
export const RECEIVE_ITEM_DESCRIPTION = 'RECEIVE_ITEM_DESCRIPTION';

interface IUniqueItemProps {
  cityId?: string;
  userId?: string;
}

interface IItemsProps extends IUniqueItemProps {
  dataMap: IItemsMap;
  aliases: IAlias[];
}

export const selectItem = (itemId: string) => ({
  type: SELECT_ITEM,
  itemId
});

export const clearSelectedItem = () => ({
  type: CLEAR_SELECTED_ITEM
});

export const receiveItems = ({ dataMap, aliases, cityId, userId }: IItemsProps) => ({
  type: RECEIVE_ITEMS,
  dataMap,
  aliases,
  cityId,
  userId
});

export const receiveItem = (item: IItem) => ({
  type: RECEIVE_ITEM,
  itemId: item.id,
  item
});

export const receiveItemDesc = (itemId: string, descFields: IItemDescFields) => ({
  type: RECEIVE_ITEM_DESCRIPTION,
  itemId,
  descFields
});

export const removeItem = (item: IItem) => ({
  type: REMOVE_ITEM,
  item
});

export const receiveImages = (id: string, images: IImage[]) => ({
  type: RECEIVE_IMAGES,
  id,
  images
});

export const toggleItemEnabledField = (itemId: string, isEnabled: boolean) => ({
  type: TOGGLE_ITEM_ENABLED,
  itemId,
  isEnabled
});

export const toggleItemRecommendedField = (itemId: string, isRecommended: boolean) => ({
  type: TOGGLE_ITEM_RECOMMENDED,
  itemId,
  isRecommended
});

export const receiveUniqueItems = (items: IItem[], params: IUniqueItemProps = {}) => (dispatch, getState) => {
  const { userId, cityId } = params;
  const state: IAppState = getState();
  const uniqueItems = items.filter(item => !getItemById(state, item.id));
  const { dataMap, aliases } = getNormalizedData(uniqueItems);
  dispatch(receiveItems({ dataMap, aliases, userId, cityId }));
  dispatch(endLoading(CONTENT_LOADER_ID));
};

export const loadRecommendedItems = () => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`${config.host}/api/items/recommended`)
    .then(handleApiResponse)
    .then((items: IItem[]) => {
      dispatch(receiveUniqueItems(items));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};

export const loadItem = (alias: string) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.get(`${config.host}/api/items/view-item/${alias}`)
    .then(handleApiResponse)
    .then((item: IItem) => {
      dispatch(receiveItem(item));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};

export const uploadPhotos = (itemId: string, files: File[]) => (dispatch) => {
  return axios
    .put(`${config.host}/api/items/item/upload-photos/${itemId}`, getFormDataFromFiles(files), {
      onUploadProgress: (e) => onUploadProgress(e, (loadedPercent) => dispatch(setUploadProgress(loadedPercent)))
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
      const errors = err.images;
      const message = errors && errors.message || IMAGES_UPLOAD_ERROR;
      dispatch(showToast(Toast.error, message));
      dispatch(uploadError());
      return Promise.reject(errors);
    });
};

export const updatePhotos = (itemId: string, images: IImage[]) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(`${config.host}/api/items/item/update-photos/${itemId}`, {images})
    .then(handleApiResponse)
    .then((images: IImage[]) => {
      dispatch(receiveImages(itemId, images));
      dispatch(showToast(Toast.success, IMAGES_UPDATE_SUCCESS));
      dispatch(endLoading(CONTENT_LOADER_ID));
      return Promise.resolve();
    })
    .catch(err => {
      console.error(err);
      const errors = err.images;
      const message = errors && errors.message || IMAGES_UPDATE_ERROR;
      dispatch(showToast(Toast.error, message));
      dispatch(endLoading(CONTENT_LOADER_ID));
      return Promise.reject(errors);
    });
};

export const updateMainInfo = (item: IItem) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(`${config.host}/api/items/item/main-info/${item.id}`, item)
    .then(handleApiResponse)
    .then((response: IItem) => {
      dispatch(receiveItem(response));
      dispatch(stopLoading(false, ITEM_UPDATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(response);
    })
    .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const updateItemDescription = (itemId: string, itemDescFields: IItemDescFields) => (dispatch) => {
  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.put(`${config.host}/api/items/item/description/${itemId}`, itemDescFields)
  .then(handleApiResponse)
  .then((response: IItemDescFields) => {
    dispatch(receiveItemDesc(itemId, response));
    dispatch(stopLoading(false, ITEM_UPDATE_SUCCESS, CONTENT_LOADER_ID));
  })
  .catch(handleApiErrors(ITEM_UPDATE_ERROR, CONTENT_LOADER_ID, dispatch));

};

export const createItem = (item: IItem) => (dispatch) => {

  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.post(`${config.host}/api/items`, item)
    .then(handleApiResponse)
    .then((response: IItem) => {
      dispatch(receiveItem(response));
      dispatch(stopLoading(false, ITEM_CREATE_SUCCESS, CONTENT_LOADER_ID));
      return Promise.resolve(response);
    })
    .catch(handleApiErrors(ITEM_CREATE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const deleteItem = (itemId: string) => (dispatch) => {

  dispatch(startLoading(DIALOG_LOADER_ID));

  return axios.delete(`${config.host}/api/items/item/${itemId}`)
    .then(handleApiResponse)
    .then(item => {
      dispatch(removeItem(item));
      dispatch(stopLoading(false, ITEM_DELETE_SUCCESS, CONTENT_LOADER_ID));
    })
    .catch(handleApiErrors(ITEM_DELETE_ERROR, CONTENT_LOADER_ID, dispatch));
};

export const toggleItemEnabled = (itemId: string, isEnabled: boolean) => (dispatch, getState) => {
  const appState: IAppState = getState();
  const item = getItemById(appState, itemId);
  const userId = item.userId;
  return axios.patch(`${config.host}/api/items/item/toggle-enabled/${itemId}`, { userId, isEnabled })
    .then(handleApiResponse)
    .then(() => {
      dispatch(toggleItemEnabledField(itemId, isEnabled));
    })
    .catch(err => console.error('Err', err));
};

export const toggleItemRecommended = (itemId: string, isRecommended: boolean) => (dispatch) => {
  return axios.patch(`${config.host}/api/items/item/toggle-recommended/${itemId}`, { isRecommended })
    .then(handleApiResponse)
    .then(() => {
      dispatch(toggleItemRecommendedField(itemId, isRecommended));
    })
    .catch(err => console.error('Err', err));
};
