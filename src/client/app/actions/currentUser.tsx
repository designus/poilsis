import axios from 'axios';
import { getNormalizedData, getCityItems, CONTENT_LOADER_ID } from '../client-utils';
import { startLoading, endLoading, receiveItems, receiveCityItems } from '../actions';
import { IAppState, ICurrentUser } from '../reducers';
import { isAdmin } from 'global-utils';

export const RECEIVE_USER_ITEMS = 'RECEIVE_USER_ITEMS';
export const RECEIVE_USER_DETAILS = 'RECEIVE_USER_DETAILS';
export const REMOVE_USER_ITEM = 'REMOVE_USER_ITEM';

export const receiveUserItems = (userItems: string[]) => {
  return {
    type: RECEIVE_USER_ITEMS,
    userItems,
  };
};

export const receiveUserDetails = (userDetails: ICurrentUser) => {
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
  const state: IAppState = getState();
  const { currentUser } = state;
  const user = currentUser.details;
  const isAllItemsLoaded = currentUser.isAllLoaded;
  const isAdministrator = isAdmin(user.role);
  const endpoint = isAdministrator ?
    'http://localhost:3000/api/items' :
    `http://localhost:3000/api/items/user/${user.id}`;

  if (isAllItemsLoaded) {
    return;
  }

  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.get(endpoint)
    .then(response => response.data)
    .then(data => {
      const { dataMap: itemsMap, aliases } = getNormalizedData(data);
      const areAllItemsLoaded = isAdministrator;
      const cityItems = getCityItems(itemsMap, areAllItemsLoaded);
      const userItems = Object.keys(itemsMap);

      dispatch(receiveItems(itemsMap, aliases, areAllItemsLoaded));
      dispatch(receiveCityItems(cityItems));
      dispatch(receiveUserItems(userItems));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};
