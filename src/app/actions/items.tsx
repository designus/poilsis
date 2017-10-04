import axios from 'axios';

import {
  addItemsToCitiesState,
  addItemToCity,
  startLoading,
  endLoading,
  showToast,
  changeItemCity,
} from '../actions';
import { getNormalizedData, getGroupedItemsByCityId, IGenericDataMap, IAlias } from '../helpers';
import { IItemsMap, IAppState, Toast } from '../reducers';
import {
  ITEM_UPDATE_SUCCESS,
  ITEM_UPDATE_ERROR,
} from '../data-strings';

export const SELECT_ITEM = 'SELECT_ITEM';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const RECEIVE_ITEM = 'RECEIVE_ITEM';

export const selectItem = (id: string) => {
  return {
    type: SELECT_ITEM,
    itemId: id,
  };
};

export const receiveItems = (dataMap: IGenericDataMap<IItemsMap>, aliases: IAlias[], allItemsLoaded: boolean) => {
  return {
    type: RECEIVE_ITEMS,
    dataMap,
    aliases,
    allItemsLoaded,
  };
};

export const receiveItem = (item) => {
  return {
    type: RECEIVE_ITEM,
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

        const groupedItems = cityId ? {[cityId]: Object.keys(dataMap)} : getGroupedItemsByCityId(dataMap);
        const allItemsLoaded = !cityId;

        dispatch(receiveItems(dataMap, aliases, allItemsLoaded));
        dispatch(addItemsToCitiesState(groupedItems));

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
      .then(item => {
        dispatch(receiveItem(item));
        dispatch(addItemToCity(item.city, item.id));
      })
      .catch(err => {
        console.error(err);
      })
      .then(dispatch(endLoading(loaderId)));
  };
};

export const putItem = (item, loaderId) => (dispatch, getState) => {

  return new Promise((resolve, reject) => {

    dispatch(startLoading(loaderId));

    const appState: IAppState = getState();
    const oldItem = appState.items.dataMap[item.id];

    return axios.put(`http://localhost:3000/api/items/item/${item.id}`, item)
      .then(response => response.data)
      .then(item => {
        if (item.errors) {
          dispatch(showToast(Toast.error, ITEM_UPDATE_ERROR));
          resolve(item.errors);
        } else {
          dispatch(receiveItem(item));
          dispatch(changeItemCity(oldItem.city, item.city, item.id));
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
          dispatch(addItemToCity(item.city, item.id));
          resolve();
        }
      })
      .catch(err => {
        console.error(err);
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
          // TODO: Implement these actions
          // dispatch(removeItem(itemId));
          // dispatch(removeItemFromCity(item.city, itemId));
          resolve('This is error');
        }
      })
      .catch(console.error)
      .then(dispatch(endLoading(loaderId)));
  });
};
