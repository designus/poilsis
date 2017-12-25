import axios from 'axios';

import { startLoading, endLoading, showToast } from '../actions';
import {
  getNormalizedData,
  getItemsByCity,
  IAlias,
  objectToFormData,
  onUploadProgress,
  onDownloadProgress,
  // getFormData,
 } from '../client-utils';
import { ItemsDataMap, Toast, IItemsByCity, IItemsMap } from '../reducers';
import {
  ITEM_UPDATE_SUCCESS,
  ITEM_UPDATE_ERROR,
  ITEM_CREATE_SUCCESS,
  ITEM_CREATE_ERROR,
  IMAGES_UPLOAD_ERROR,
  IMAGES_UPLOAD_SUCCESS,
  IMAGES_KEY,
} from '../../../data-strings';
import { IImage } from 'global-utils';

// const objectToFormData = require('object-to-formdata');
export const SELECT_ITEM = 'SELECT_ITEM';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const RECEIVE_ITEM = 'RECEIVE_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const RECEIVE_IMAGES = 'RECEIVE_IMAGES';
export const SET_UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';

export const selectItem = (id: string) => {
  return {
    type: SELECT_ITEM,
    itemId: id,
  };
};

export const receiveItems = (dataMap: ItemsDataMap, aliases: IAlias[], allItemsLoaded: boolean, itemsByCity: IItemsByCity) => {
  return {
    type: RECEIVE_ITEMS,
    dataMap,
    aliases,
    allItemsLoaded,
    itemsByCity,
  };
};

export const receiveItem = (item: IItemsMap) => {
  return {
    type: RECEIVE_ITEM,
    item,
  };
};

export const removeItem = (item: IItemsMap) => {
  return {
    type: REMOVE_ITEM,
    item,
  };
};

export const receiveImages = (id: string, images: IImage[]) => {
  return {
    type: RECEIVE_IMAGES,
    id,
    images,
  };
};

export const setUploadProgress = (progress: number) => {
  return {
    type: SET_UPLOAD_PROGRESS,
    progress,
  };
};

export const uploadSuccess = () => ({type: UPLOAD_SUCCESS});

export const getItems = (loaderId, cityId = null) => {
  const endpoint = cityId	?
    `http://localhost:3000/api/items/city/${cityId}` :
    'http://localhost:3000/api/items';

  return (dispatch) => {

    dispatch(startLoading(loaderId));

    return axios.get(endpoint)
      .then(response => {

        const { data } = response;
        const { dataMap, aliases } = getNormalizedData(data);

        const itemsByCity = cityId ? {[cityId]: Object.keys(dataMap)} : getItemsByCity(dataMap);
        const allItemsLoaded = !cityId;

        dispatch(receiveItems(dataMap, aliases, allItemsLoaded, itemsByCity));

      })
      .catch(err => {
        console.error(err);
      })
      .then(dispatch(endLoading(loaderId)));
  };
};

export const getItem = (itemId, loaderId) => {

  return dispatch => {

    dispatch(startLoading(loaderId));

    return axios.get(`http://localhost:3000/api/items/item/${itemId}`)
      .then(response => response.data)
      .then(item => dispatch(receiveItem(item)))
      .catch(err => {
        console.error(err);
      })
      .then(dispatch(endLoading(loaderId)));
  };
};

export const uploadImages = (itemId, files) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const formData = objectToFormData({files});
    return axios
      .put(`http://localhost:3000/api/items/item/${itemId}/photos`, formData, {
        onUploadProgress: (e) => onUploadProgress(e, (loadedPercent) => dispatch(setUploadProgress(loadedPercent))),
        onDownloadProgress: (e) => onDownloadProgress(e, () => dispatch(uploadSuccess())),
      })
      .then(response => response.data)
      .then(images => {
        if (images.errors) {
          const errors = images.errors[IMAGES_KEY];
          const message = errors && errors.message || IMAGES_UPLOAD_ERROR;
          dispatch(showToast(Toast.error, message));
          reject(images.errors);
        } else {
          dispatch(receiveImages(itemId, images));
          dispatch(showToast(Toast.success, IMAGES_UPLOAD_SUCCESS));
          resolve();
        }
      })
      .catch(err => {
        console.error(err);
        dispatch(showToast(Toast.error, IMAGES_UPLOAD_ERROR));
      });
  });
};

export const putItem = (item, loaderId) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {

    dispatch(startLoading(loaderId));

    return axios.put(`http://localhost:3000/api/items/item/${item.id}`, item)
      .then(response => response.data)
      .then(item => {
        if (item.errors) {
          dispatch(showToast(Toast.error, ITEM_UPDATE_ERROR));
          resolve(item.errors);
        } else {
          dispatch(receiveItem(item));
          dispatch(showToast(Toast.success, ITEM_UPDATE_SUCCESS));
          resolve();
        }
      })
      .catch(err => {
        console.error(err);
        dispatch(showToast(Toast.error, ITEM_UPDATE_ERROR));
      })
      .then(dispatch(endLoading(loaderId)));
  });
};

export const postItem = (item, loaderId) => (dispatch) => {

  return new Promise(resolve => {

    dispatch(startLoading(loaderId));

    return axios.post('http://localhost:3000/api/items', item)
      .then(response => response.data)
      .then(item => {
        if (item.errors) {
          resolve(item.errors);
        } else {
          dispatch(receiveItem(item));
          dispatch(showToast(Toast.success, ITEM_CREATE_SUCCESS));
          resolve();
        }
      })
      .catch(err => {
        console.error(err);
        dispatch(showToast(Toast.success, ITEM_CREATE_ERROR));
      })
      .then(dispatch(endLoading(loaderId)));
  });
};

export const deleteItem = (itemId, loaderId) => (dispatch) => {

  return new Promise(resolve => {

    dispatch(startLoading(loaderId));

    return axios.delete(`http://localhost:3000/api/items/item/${itemId}`)
      .then(response => response.data)
      .then(item => {
        if (item.errors) {
          resolve(item.errors);
        } else {
          dispatch(removeItem(item));
          resolve();
        }
      })
      .catch(console.error)
      .then(dispatch(endLoading(loaderId)));
  });
};
