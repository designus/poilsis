import { batch } from 'react-redux';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getNormalizedData, setAcceptLanguageHeader } from 'client-utils/methods';
import { showLoader, hideLoader } from 'actions/loader';
import { receiveItems } from 'actions/items';
import { CurrentUserActionTypes, ThunkResult, UserDetails } from 'types';
import { isAdmin } from 'global-utils';
import { Item } from 'global-utils/data-models';
import { getAdminLocale } from 'selectors';
import { handleApiResponse, http } from './utils';

export const receiveUserDetails = (userDetails: UserDetails | null) => ({
  type: CurrentUserActionTypes.RECEIVE_USER_DETAILS,
  userDetails
}) as const;

export const setUserItems = () => ({
  type: CurrentUserActionTypes.SET_USER_ITEMS
}) as const;

export const loadUserItems = (): ThunkResult<Promise<void> | null> => (dispatch, getState) => {
  const state = getState();
  const locale = getAdminLocale(state);
  const { currentUser } = state;
  const user = currentUser.details;
  const isAdministrator = isAdmin(user?.role);
  const endpoint = isAdministrator || !user ?
    '/api/items' :
    `/api/items/user/${user.id}`;

  if (currentUser.hasItems) {
    return null;
  }

  dispatch(showLoader(CONTENT_LOADER_ID));

  return http.get<Item[]>(endpoint, setAcceptLanguageHeader(locale))
    .then(response => handleApiResponse(response))
    .then(items => {
      const data = getNormalizedData(items);
      batch(() => {
        dispatch(receiveItems(data.dataMap, data.aliases));
        dispatch(setUserItems());
        dispatch(hideLoader(CONTENT_LOADER_ID));
      });
    })
    .catch(err => {
      console.error(err);
      dispatch(hideLoader(CONTENT_LOADER_ID));
    });
};
