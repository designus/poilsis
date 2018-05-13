import axios from 'axios';
import { getNormalizedData, getItemsByCity, CONTENT_LOADER_ID } from '../client-utils';
import { startLoading, endLoading, receiveItems } from '../actions';
import { IAppState, IUser } from '../reducers';

export const RECEIVE_USER_ITEMS = 'RECEIVE_USER_ITEMS';
export const RECEIVE_USER_DETAILS = 'RECEIVE_USER_DETAILS';
export const REMOVE_USER_ITEM = 'REMOVE_USER_ITEM';

export const receiveUserItems = (userItems: string[]) => {
  return {
    type: RECEIVE_USER_ITEMS,
    userItems,
  };
};

export const receiveUserDetails = (userDetails: IUser) => {
  return {
    type: RECEIVE_USER_DETAILS,
    userDetails,
  };
};

export const removeUserItem = (itemId: string) => {
  return {
    type: REMOVE_USER_ITEM,
    itemId,
  };
};

export const getUserItems = () => (dispatch, getState) => {
  dispatch(startLoading(CONTENT_LOADER_ID));
  const state: IAppState = getState();
  const user = state.user.details;
  const isAdmin = user.role === 'admin';
  const endpoint = isAdmin ?
    'http://localhost:3000/api/items' :
    `http://localhost:3000/api/items/user/${user.id}`;

  return axios.get(endpoint)
    .then(response => response.data)
    .then(data => {
      const { dataMap, aliases } = getNormalizedData(data);
      const areAllItemsLoaded = isAdmin;
      const itemsByCity = getItemsByCity(dataMap, areAllItemsLoaded);
      const userItems = Object.keys(dataMap);

      dispatch(receiveUserItems(userItems));
      dispatch(receiveItems(dataMap, aliases, areAllItemsLoaded, itemsByCity));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};
