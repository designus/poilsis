import axios from 'axios';
import { getNormalizedData, CONTENT_LOADER_ID, setAcceptLanguageHeader } from 'client-utils';
import { startLoading, endLoading, receiveItems } from 'actions';
import { IAppState, ICurrentUser } from 'reducers';
import { isAdmin } from 'global-utils';
import { getLocale } from 'selectors';

export const RECEIVE_USER_ITEMS = 'RECEIVE_USER_ITEMS';
export const RECEIVE_USER_DETAILS = 'RECEIVE_USER_DETAILS';

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

  return axios.get(endpoint, setAcceptLanguageHeader(getLocale(state)))
    .then(response => response.data)
    .then(data => {
      const { dataMap, aliases } = getNormalizedData(data);
      const isAllLoaded = isAdministrator;
      const userItems = Object.keys(dataMap);

      dispatch(receiveItems({ dataMap, aliases, isAllLoaded }));
      dispatch(receiveUserItems(userItems));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};
