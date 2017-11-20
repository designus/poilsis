import axios from 'axios';

import { startLoading, endLoading, showToast } from '../actions';
import { getNormalizedData, getItemsByCity, IAlias } from '../helpers';
import { ItemsDataMap, Toast, IItemsByCity, IItemsMap } from '../reducers';
import { ITEM_UPDATE_SUCCESS, ITEM_UPDATE_ERROR, ITEM_CREATE_SUCCESS, ITEM_CREATE_ERROR } from '../data-strings';

export const SELECT_ITEM = 'SELECT_ITEM';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const RECEIVE_ITEM = 'RECEIVE_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';

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

export const putItem = (item, loaderId) => (dispatch, getState) => {

  return new Promise((resolve, reject) => {

    const formData = new FormData();
    const images = item.images;

    Object.keys(item)
      .filter(key => key !== 'images')
      .forEach(key => formData.append(key, item[key]));

    if (images) {
      images.forEach((image) => formData.append('images', image));
    }

    dispatch(startLoading(loaderId));

    return axios.put(`http://localhost:3000/api/items/item/${item.id}`, formData)
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
