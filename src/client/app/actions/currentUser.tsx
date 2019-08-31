import axios from 'axios';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { startLoading, endLoading } from 'actions/loader';
import { receiveNewItems } from 'actions/items';
import { IAppState, ICurrentUser, CurrentUserActionTypes, IReceiveUserDetails } from 'types';
import { isAdmin, IItem } from 'global-utils';
import { handleApiResponse } from './utils';
import { config } from '../../../../config';

export const receiveUserDetails = (userDetails: ICurrentUser): IReceiveUserDetails => ({
  type: CurrentUserActionTypes.RECEIVE_USER_DETAILS,
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
      dispatch(receiveNewItems(items, { userId: user.id, dataType: 'currentUser' }));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};
