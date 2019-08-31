import axios from 'axios';

import {
  setUploadProgress,
  uploadError,
  uploadSuccess
} from 'actions/upload';

import { showToast } from 'actions/toast';
import { startLoading, endLoading } from 'actions/loader';
import { onUploadProgress, getFormDataFromFiles, getNormalizedData } from 'client-utils/methods';
import { IAlias, IItemsMap, Toast, IAppState } from 'types';
import { CONTENT_LOADER_ID, DIALOG_LOADER_ID } from 'client-utils/constants';
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
import { IImage, IItem, IItemDescFields, Omit, Value } from 'global-utils/typings';
import { getItemById } from 'selectors';
import {
  ItemsActionTypes,
  ISelectItem,
  IClearSelectedItem,
  IReceiveItems,
  IReceiveItem,
  IReceiveRecommendedItems,
  IReceiveImages,
  IReceiveItemDescription,
  IRemoveItem,
  IToggleItemEnabled,
  IToggleItemRecommended,
  IUniqueItemProps
} from 'types/items';

import { stopLoading, handleApiResponse, handleApiErrors } from './utils';
import { config } from '../../../../config';

export const selectItem = (itemId: Value<ISelectItem, 'itemId'>): ISelectItem => ({
  type: ItemsActionTypes.SELECT_ITEM,
  itemId
});

export const clearSelectedItem = (): IClearSelectedItem => ({
  type: ItemsActionTypes.CLEAR_SELECTED_ITEM
});

export const receiveItems = (props: Omit<IReceiveItems, 'type'>): IReceiveItems => ({
  type: ItemsActionTypes.RECEIVE_ITEMS,
  dataMap: props.dataMap,
  aliases: props.aliases,
  cityId: props.cityId,
  userId: props.userId,
  dataType: props.dataType
});

export const receiveRecommendedItems = (items: string[]): IReceiveRecommendedItems => ({
  type: ItemsActionTypes.RECEIVE_RECOMMENDED_ITEMS,
  items
});

export const receiveItem = (item: IItem): IReceiveItem => ({
  type: ItemsActionTypes.RECEIVE_ITEM,
  item
});

export const receiveItemDescription = (itemId: string, descFields: IItemDescFields): IReceiveItemDescription => ({
  type: ItemsActionTypes.RECEIVE_ITEM_DESCRIPTION,
  itemId,
  descFields
});

export const removeItem = (itemId: string): IRemoveItem => ({
  type: ItemsActionTypes.REMOVE_ITEM,
  itemId
});

export const receiveImages = (itemId: string, images: IImage[]): IReceiveImages => ({
  type: ItemsActionTypes.RECEIVE_IMAGES,
  itemId,
  images
});

export const toggleItemEnabledField = (itemId: string, isEnabled: boolean): IToggleItemEnabled => ({
  type: ItemsActionTypes.TOGGLE_ITEM_ENABLED,
  itemId,
  isEnabled
});

export const toggleItemRecommendedField = (itemId: string, isRecommended: boolean): IToggleItemRecommended => ({
  type: ItemsActionTypes.TOGGLE_ITEM_RECOMMENDED,
  itemId,
  isRecommended
});

export const getNewItems = (items: IItem[], state: IAppState) => items.filter(item => !getItemById(state, item.id));

export const receiveNewItems = (items: IItem[], params: IUniqueItemProps = {}) => (dispatch, getState) => {
  const { userId, cityId, dataType } = params;
  const state: IAppState = getState();
  const newItems = getNewItems(items, state);
  const { dataMap, aliases } = getNormalizedData(newItems);
  dispatch(receiveItems({ dataMap, aliases, userId, cityId, dataType }));
};

export const loadRecommendedItems = () => (dispatch, getState) => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  return axios.get(`${config.host}/api/items/recommended`)
    .then(handleApiResponse)
    .then((items: IItem[]) => {
      const recommendedItems = items.map(item => item.id);
      dispatch(receiveNewItems(items));
      dispatch(receiveRecommendedItems(recommendedItems));
      dispatch(endLoading(CONTENT_LOADER_ID));
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
    dispatch(receiveItemDescription(itemId, response));
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
    .then((item: IItem) => {
      dispatch(removeItem(item.id));
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
