import axios from 'axios';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { startLoading, endLoading } from 'actions/loader';
import { receiveUniqueItems } from 'actions/items';
import { IAppState, ICurrentUser } from 'reducers';
import { isAdmin, IItem } from 'global-utils';
import { handleApiResponse } from './utils';
import { config } from '../../../../config';

export const RECEIVE_USER_DETAILS = 'RECEIVE_USER_DETAILS';

export const receiveUserDetails = (userDetails: ICurrentUser) => ({
  type: RECEIVE_USER_DETAILS,
  userDetails
});

export const loadUserItems = () => (dispatch, getState) => {
  const state: IAppState = getState();
  const { currentUser } = state;
  const user = currentUser.details;
  const isAdministrator = isAdmin(user.role);
  const endpoint = isAdministrator ?
    `${config.host}/api/items` :
    `${config.host}/api/items/user/${user.id}`;

  if (currentUser.hasItems) {
    return;
  }

  dispatch(startLoading(CONTENT_LOADER_ID));

  return axios.get(endpoint)
    .then(handleApiResponse)
    .then((items: IItem[]) => {
      dispatch(receiveUniqueItems(items, { userId: user.id }));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};
