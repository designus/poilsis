import axios from 'axios';

import {
  startLoading,
  endLoading,
  showToast,
  setUploadProgress,
  uploadError,
  uploadSuccess,
  removeUserItem,
} from '../actions';
import {
  IAlias,
  objectToFormData,
  onUploadProgress,
 } from '../client-utils';
import { IItemsMap, Toast, IItem } from '../reducers';
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
} from 'data-strings';
import { IImage, IItemFields } from 'global-utils';

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

export const receiveItems = (dataMap: IItemsMap, aliases: IAlias[], isAllLoaded: boolean) => {
  return {
    type: RECEIVE_ITEMS,
    dataMap,
    aliases,
    isAllLoaded,
  };
};

export const receiveItem = (item: IItem) => {
  return {
    type: RECEIVE_ITEM,
    item,
  };
};

export const removeItem = (item: IItem) => {
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

export const stopLoading = (isError, toastMessage) => dispatch => {
  const toastType = isError ? Toast.error : Toast.success;
  dispatch(endLoading());
  dispatch(showToast(toastType, toastMessage));
};

export const getItem = (itemId) => {

  return dispatch => {

    dispatch(startLoading());

    return axios.get(`http://localhost:3000/api/items/item/${itemId}`)
      .then(response => response.data)
      .then(item => {
        dispatch(receiveItem(item));
        dispatch(endLoading());
      })
      .catch(err => {
        console.error(err);
        dispatch(endLoading());
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
          dispatch(setUploadProgress(100));
          dispatch(showToast(Toast.success, IMAGES_UPLOAD_SUCCESS));
          dispatch(uploadSuccess());
          resolve(images);
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
    dispatch(startLoading());

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
      .then(dispatch(endLoading()));

  });
};

export const updateMainInfo = (item: IItemFields) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(startLoading());

    return axios.put(`http://localhost:3000/api/items/item/mainInfo/${item.id}`, item)
      .then(response => response.data)
      .then(item => {
        dispatch(endLoading());
        if (item.errors) {
          dispatch(showToast(Toast.error, ITEM_UPDATE_ERROR));
          reject(item.errors);
        } else {
          dispatch(receiveItem(item));
          dispatch(showToast(Toast.success, ITEM_UPDATE_SUCCESS));
          resolve(item);
        }
      })
      .catch(err => {
        console.error(err);
        dispatch(endLoading());
        dispatch(showToast(Toast.error, ITEM_UPDATE_ERROR));
      });
  });
};

export const postItem = (item) => (dispatch) => {

  return new Promise((resolve, reject) => {

    dispatch(startLoading());

    return axios.post('http://localhost:3000/api/items', item)
      .then(response => response.data)
      .then(item => {
        if (item.errors) {
          dispatch(stopLoading(true, ITEM_CREATE_ERROR));
          reject(item.errors);
        } else {
          dispatch(receiveItem(item));
          dispatch(stopLoading(false, ITEM_CREATE_SUCCESS));
          resolve({itemId: item.id, userId: item.userId});
        }
      })
      .catch(err => {
        console.error(err);
        dispatch(stopLoading(true, ITEM_CREATE_ERROR));
      });
  });
};

export const deleteItem = (itemId: string) => (dispatch) => {

  return new Promise((resolve, reject) => {

    dispatch(startLoading());

    return axios.delete(`http://localhost:3000/api/items/item/${itemId}`)
      .then(response => response.data)
      .then(item => {
        dispatch(endLoading());
        if (item.errors) {
          dispatch(showToast(Toast.error, DELETE_ITEM_ERROR));
          reject(item.errors);
        } else {
          dispatch(removeItem(item));
          dispatch(removeUserItem(itemId));
          dispatch(showToast(Toast.success, DELETE_ITEM_SUCCESS));
          resolve();
        }
      })
      .catch(err => {
        console.error(err);
        dispatch(endLoading());
      });
  });
};
