import { batch } from 'react-redux';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getNormalizedData, setAcceptLanguageHeader, getNewItems } from 'client-utils/methods';
import { startLoading, endLoading } from 'actions/loader';
import { receiveItems } from 'actions/items';
import { CurrentUserActionTypes, IReceiveUserDetails, ThunkResult, ISetUserItems, ActionCreator } from 'types';
import { isAdmin, IItem } from 'global-utils';
import { getAdminLocale, getCurrentUser } from 'selectors';
import { handleApiResponse, http } from './utils';

export const receiveUserDetails: ActionCreator<IReceiveUserDetails> = props => ({
  type: CurrentUserActionTypes.RECEIVE_USER_DETAILS,
  ...props
});

export const setUserItems = (): ISetUserItems => ({
  type: CurrentUserActionTypes.SET_USER_ITEMS
});

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

  dispatch(startLoading(CONTENT_LOADER_ID));

  return http.get<IItem[]>(endpoint, setAcceptLanguageHeader(locale))
    .then(response => handleApiResponse(response))
    .then(items => {
      const data = getNormalizedData(items);
      batch(() => {
        dispatch(receiveItems(data));
        dispatch(setUserItems());
        dispatch(endLoading(CONTENT_LOADER_ID));
      });
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};
