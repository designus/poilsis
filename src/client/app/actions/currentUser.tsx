import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getNormalizedData } from 'client-utils/methods';
import { startLoading, endLoading } from 'actions/loader';
import { receiveItems } from 'actions/items';
import { IAppState, ICurrentUser, CurrentUserActionTypes, IReceiveUserDetails } from 'types';
import { isAdmin, IItem } from 'global-utils';
import { handleApiResponse, http } from './utils';

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
    '/api/items' :
    `/api/items/user/${user.id}`;

  if (currentUser.hasItems) {
    return;
  }

  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.get(endpoint)
    .then(handleApiResponse)
    .then((items: IItem[]) => {
      const { dataMap, aliases } = getNormalizedData(items);
      dispatch(receiveItems({ dataMap, aliases, userId: user.id, dataType: 'currentUser' }));
      dispatch(endLoading(CONTENT_LOADER_ID));
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};
