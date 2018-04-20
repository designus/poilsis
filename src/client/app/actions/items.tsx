import axios from 'axios';

import { startLoading, endLoading, showToast, setUploadProgress, uploadError, uploadSuccess } from '../actions';
import {
  getNormalizedData,
  getItemsByCity,
  IAlias,
  objectToFormData,
  CONTENT_LOADER_ID,
  DIALOG_LOADER_ID,
  onUploadProgress,
  // getFormData,
 } from '../client-utils';
import { ItemsDataMap, Toast, IItemsByCity, IItemsMap, IAppState } from '../reducers';
import {
  ITEM_UPDATE_SUCCESS,
  ITEM_UPDATE_ERROR,
  ITEM_CREATE_SUCCESS,
  ITEM_CREATE_ERROR,
  DELETE_ITEM_ERROR,
  DELETE_ITEM_SUCCESS,
  IMAGES_UPLOAD_ERROR,
  IMAGES_UPLOAD_SUCCESS,
  IMAGES_UPDATE_SUCCESS,
  IMAGES_UPDATE_ERROR,
  IMAGES_KEY,
} from '../../../data-strings';
import { IImage, IMainInfoFields } from 'global-utils';

// const objectToFormData = require('object-to-formdata');
export const SELECT_ITEM = 'SELECT_ITEM';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const RECEIVE_ITEM = 'RECEIVE_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const RECEIVE_IMAGES = 'RECEIVE_IMAGES';

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

export const getUserItems = () => (dispatch, getState) => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  const state: IAppState = getState();
  const user = state.auth.user;
  const isAdmin = user.role === 'admin';
  const endpoint = isAdmin ?
    'http://localhost:3000/api/items' :
    `http://localhost:3000/api/items/user/${user.id}`;

  return axios.get(endpoint)
    .then(response => response.data)
    .then(data => {
      const { dataMap, aliases } = getNormalizedData(data);
      const itemsByCity = getItemsByCity(dataMap);
      const allItemsLoaded = isAdmin;

      dispatch(receiveItems(dataMap, aliases, allItemsLoaded, itemsByCity));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};

export const getCityItems = (cityId) => {
  return (dispatch) => {

    dispatch(startLoading(CONTENT_LOADER_ID));

    return axios.get(`http://localhost:3000/api/items/city/${cityId}`)
      .then(response => response.data)
      .then(data => {

        const { dataMap, aliases } = getNormalizedData(data);
        const itemsByCity = { [cityId]: Object.keys(dataMap) };
        const allItemsLoaded = false;

        dispatch(receiveItems(dataMap, aliases, allItemsLoaded, itemsByCity));
        dispatch(endLoading(CONTENT_LOADER_ID));

      })
      .catch(err => {
        console.error(err);
        dispatch(endLoading(CONTENT_LOADER_ID));
      });
  };
};

export const getItem = (itemId) => {

  return dispatch => {

    dispatch(startLoading(CONTENT_LOADER_ID));

    return axios.get(`http://localhost:3000/api/items/item/${itemId}`)
      .then(response => response.data)
      .then(item => {
        dispatch(receiveItem(item));
        dispatch(endLoading(CONTENT_LOADER_ID));
      })
      .catch(err => {
        dispatch(endLoading(CONTENT_LOADER_ID));
        console.error(err);
      });
  };
};

export const uploadPhotos = (itemId, files) => (dispatch) => {
  return new Promise((resolve, reject) => {
    const formData = objectToFormData({files});
    return axios
      .put(`http://localhost:3000/api/items/item/upload-photos/${itemId}`, formData, {
        onUploadProgress: (e) => onUploadProgress(e, (loadedPercent) => dispatch(setUploadProgress(loadedPercent))),
      })
      .then(response => response.data)
      .then(images => {
        if (images.errors) {
          const errors = images.errors[IMAGES_KEY];
          const message = errors && errors.message || IMAGES_UPLOAD_ERROR;
          dispatch(showToast(Toast.error, message));
          dispatch(uploadError());
          reject(images.errors);
        } else {
          dispatch(receiveImages(itemId, images));
          setUploadProgress(100);
          dispatch(showToast(Toast.success, IMAGES_UPLOAD_SUCCESS));
          dispatch(uploadSuccess());
          resolve();
        }
      })
      .catch(err => {
        console.error(err);
        dispatch(showToast(Toast.error, IMAGES_UPLOAD_ERROR));
      });
  });
};

export const updatePhotos = (itemId: string, images: IImage[]) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(startLoading(CONTENT_LOADER_ID));

    return axios.put(`http://localhost:3000/api/items/item/photos/${itemId}`, {images})
      .then(response => response.data)
      .then(images => {
        if (images.errors) {
          const errors = images.errors[IMAGES_KEY];
          const message = errors && errors.message || IMAGES_UPLOAD_ERROR;
          dispatch(showToast(Toast.error, message));
          reject(images.errors);
        } else {
          dispatch(receiveImages(itemId, images));
          dispatch(showToast(Toast.success, IMAGES_UPDATE_SUCCESS));
          resolve();
        }
      })
      .catch(err => {
        console.error(err);
        dispatch(showToast(Toast.error, IMAGES_UPDATE_ERROR));
      })
      .then(dispatch(endLoading(CONTENT_LOADER_ID)));

  });
};

export const updateMainInfo = (item: IMainInfoFields) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {

    dispatch(startLoading(CONTENT_LOADER_ID));

    return axios.put(`http://localhost:3000/api/items/item/mainInfo/${item.id}`, item)
      .then(response => response.data)
      .then(item => {
        if (item.errors) {
          dispatch(showToast(Toast.error, ITEM_UPDATE_ERROR));
          reject(item.errors);
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
      .then(dispatch(endLoading(CONTENT_LOADER_ID)));
  });
};

export const postItem = (item) => (dispatch) => {

  return new Promise((resolve, reject) => {

    dispatch(startLoading(CONTENT_LOADER_ID));

    return axios.post('http://localhost:3000/api/items', item)
      .then(response => response.data)
      .then(item => {
        if (item.errors) {
          dispatch(showToast(Toast.error, ITEM_CREATE_ERROR));
          reject(item.errors);
        } else {
          dispatch(receiveItem(item));
          dispatch(endLoading(CONTENT_LOADER_ID));
          dispatch(showToast(Toast.success, ITEM_CREATE_SUCCESS));
          resolve(item.id);
        }
      })
      .catch(err => {
        console.error(err);
        dispatch(endLoading(CONTENT_LOADER_ID));
        dispatch(showToast(Toast.error, ITEM_CREATE_ERROR));
      });
  });
};

export const deleteItem = (itemId) => (dispatch) => {

  return new Promise((resolve, reject) => {

    dispatch(startLoading(DIALOG_LOADER_ID));

    return axios.delete(`http://localhost:3000/api/items/item/${itemId}`)
      .then(response => response.data)
      .then(item => {
        dispatch(endLoading(DIALOG_LOADER_ID));
        if (item.errors) {
          dispatch(showToast(Toast.error, DELETE_ITEM_ERROR));
          reject(item.errors);
        } else {
          dispatch(removeItem(item));
          dispatch(showToast(Toast.success, DELETE_ITEM_SUCCESS));
          resolve();
        }
      })
      .catch(err => {
        console.error(err);
        dispatch(endLoading(DIALOG_LOADER_ID));
      });
  });
};
