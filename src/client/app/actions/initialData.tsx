import { AxiosResponse } from 'axios';
import { getNormalizedData, setAcceptLanguageHeader } from 'client-utils/methods';
import { setClientLocale } from 'actions/locale';
import { receiveUserDetails } from 'actions/currentUser';
import { getAccessTokenClaims, DEFAULT_LANGUAGE, ICity, IType, Languages, isAdmin as isUserAdmin, IUser } from 'global-utils';
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
  pathName?: string;
  locale?: Languages;
}

export const receiveInitialData: ActionCreator<IReceiveInitialData> = params => ({
  type: InitialDataActionTypes.RECEIVE_INITIAL_DATA,
  ...params
});

export const clearAllData: ActionCreator<IClearAllData> = () => ({
  type: InitialDataActionTypes.CLEAR_ALL_DATA
});

export const getInitialData = (params: IGetInitialDataParams): ThunkResult<Promise<void>> => {
  return (dispatch, getState) => {
    const state = getState();
    const locale = params.locale || getClientLocale(state) || DEFAULT_LANGUAGE;
    const token = getAccessToken(state);
    const accessTokenClaims = token ? getAccessTokenClaims(token) : null;

    if (locale !== getClientLocale(state)) {
      dispatch(setClientLocale({ locale }));
    }

    const isLoggedIn = loggedIn(state);

    const apis = {
      cities: isLoggedIn ? '/api/cities/admin-cities' : '/api/cities/client-cities',
      types: isLoggedIn ? '/api/types/admin-types' : '/api/types/client-types'
    };

    const promises = [
      http.get(apis.cities, setAcceptLanguageHeader(locale)),
      http.get(apis.types, setAcceptLanguageHeader(locale))
    ];

    if (isLoggedIn) {
      promises.push(http.get('/api/users'));
    }

    return Promise.all(promises)
      .then((response: [AxiosResponse<ICity[]>, AxiosResponse<IType[]>, AxiosResponse<IUser[]>]) => {
        const [citiesResponse, typesResponse, usersResponse] = response;
        const cities = getNormalizedData(citiesResponse.data);
        const types = getNormalizedData(typesResponse.data);
        let users = {};

        if (usersResponse) {
          users = getNormalizedData(usersResponse.data);
        }

        dispatch(receiveInitialData({ cities, types, users, isLoggedIn }));

        if (accessTokenClaims) {
          const { userId, userName, userRole } = accessTokenClaims;
          dispatch(receiveUserDetails({ userDetails: { id: userId, name: userName, role: userRole } }));
        }
      })
      .catch(console.error);
  };
};
