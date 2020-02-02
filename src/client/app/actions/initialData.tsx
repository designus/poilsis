import { batch } from 'react-redux';
import { AxiosResponse } from 'axios';
import { getNormalizedData, setAcceptLanguageHeader, getUserDetails } from 'client-utils/methods';
import { setClientLocale } from 'actions/locale';
import { receiveUserDetails } from 'actions/currentUser';
import { getAccessTokenClaims, DEFAULT_LANGUAGE, ICity, IType, Locale, isAdmin as isUserAdmin, IUser } from 'global-utils';
import {
  InitialDataActionTypes,
  IClearAllData,
  IReceiveInitialData,
  ThunkResult,
  ActionCreator
} from 'types';
import { getClientLocale, isLoggedIn as loggedIn, getAccessToken } from 'selectors';
import { http } from './utils';

export interface IGetInitialDataParams {
  locale?: Locale;
}

export const receiveInitialData: ActionCreator<IReceiveInitialData> = params => ({
  type: InitialDataActionTypes.RECEIVE_INITIAL_DATA,
  ...params
});

export const clearAllData = (): IClearAllData => ({
  type: InitialDataActionTypes.CLEAR_ALL_DATA
});

export const getAdminInitialData = (params: IGetInitialDataParams): ThunkResult<Promise<void>> => (dispatch, getState) => {
  const state = getState();
  const locale = params.locale || getClientLocale(state) || DEFAULT_LANGUAGE;
  const token = getAccessToken(state);
  const accessTokenClaims = getAccessTokenClaims(token);

  if (locale !== getClientLocale(state)) {
    dispatch(setClientLocale({ locale }));
  }

  const promises = [
    http.get('/api/cities/admin-cities'),
    http.get('/api/types/admin-types'),
    http.get('/api/users')
  ];

  return Promise.all(promises)
    .then(response => {
      const [citiesResponse, typesResponse, usersResponse] = response;
      const cities = getNormalizedData(citiesResponse.data as ICity[]);
      const types = getNormalizedData(typesResponse.data as IType[]);
      const users = getNormalizedData(usersResponse.data as IUser[]);

      batch(() => {
        dispatch(receiveInitialData({ cities, types, users, isLoggedIn: true }));
        dispatch(receiveUserDetails({ userDetails: getUserDetails(accessTokenClaims) }));
      });
    })
    .catch(console.error);

};

export const getClientInitialData = (params: IGetInitialDataParams): ThunkResult<Promise<void>> => {
  return (dispatch, getState) => {
    const state = getState();
    const locale = params.locale || getClientLocale(state) || DEFAULT_LANGUAGE;
    const token = getAccessToken(state);
    const accessTokenClaims = token ? getAccessTokenClaims(token) : null;

    if (locale !== getClientLocale(state)) {
      dispatch(setClientLocale({ locale }));
    }

    const promises = [
      http.get('/api/cities/client-cities', setAcceptLanguageHeader(locale)),
      http.get('/api/types/client-types', setAcceptLanguageHeader(locale))
    ];

    return Promise.all(promises)
      .then((response) => {
        const [citiesResponse, typesResponse] = response;
        const cities = getNormalizedData(citiesResponse.data as ICity[]);
        const types = getNormalizedData(typesResponse.data as IType[]);

        batch(() => {
          dispatch(receiveInitialData({ cities, types, users: {}, isLoggedIn: false }));
          if (accessTokenClaims) {
            dispatch(receiveUserDetails({ userDetails: getUserDetails(accessTokenClaims) }));
          }
        });
      })
      .catch(console.error);
  };
};

export const getInitialData = (params: IGetInitialDataParams): ThunkResult<Promise<void>> => (dispatch, getState) => {
  const isLoggedIn = loggedIn(getState());
  if (isLoggedIn) {
    return dispatch(getAdminInitialData(params));
  } else {
    return dispatch(getClientInitialData(params));
  }
};
