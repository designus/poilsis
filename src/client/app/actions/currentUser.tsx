import { batch } from 'react-redux';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getNormalizedData, setAcceptLanguageHeader, getNewItems } from 'client-utils/methods';
import { startLoading, endLoading } from 'actions/loader';
import { receiveItems } from 'actions/items';
import { CurrentUserActionTypes, IReceiveUserDetails, ThunkResult, IReceiveUserItems, ActionCreator } from 'types';
import { isAdmin, IItem } from 'global-utils';
import { getAdminLocale } from 'selectors';
import { handleApiResponse, http } from './utils';

export const receiveUserDetails: ActionCreator<IReceiveUserDetails> = props => ({
  type: CurrentUserActionTypes.RECEIVE_USER_DETAILS,
  ...props
});

export const receiveUserItems: ActionCreator<IReceiveUserItems> = () => ({
  type: CurrentUserActionTypes.RECEIVE_USER_ITEMS
});

export const loadUserItems = (): ThunkResult<Promise<void>> => (dispatch, getState) => {
  const state = getState();
  const locale = getAdminLocale(state);
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

  return http.get<IItem[]>(endpoint, setAcceptLanguageHeader(locale))
    .then(response => handleApiResponse(response))
    .then(items => {
      const data = getNormalizedData(items);
      batch(() => {
        dispatch(receiveItems(data));
        dispatch(receiveUserItems());
        dispatch(endLoading(CONTENT_LOADER_ID));
      });
    })
    .catch(err => {
      console.error(err);
      dispatch(endLoading(CONTENT_LOADER_ID));
    });
};
