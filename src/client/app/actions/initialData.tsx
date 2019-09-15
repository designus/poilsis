import axios, { AxiosResponse } from 'axios';
import { getNormalizedData } from 'client-utils/methods';
import { setLocale } from 'actions/locale';
import { receiveUserDetails } from 'actions/currentUser';
import { getAccessTokenClaims, DEFAULT_LANGUAGE, ICity, IType, IUser } from 'global-utils';
import {
  IAppState,
  IClearState,
  InitialDataActionTypes,
  IInitialData,
  IReceiveInitialData
} from 'types';
import { getLocale } from 'selectors';
import { config } from 'config';
import { http } from './utils';

export interface IGetInitialDataParams {
  pathName?: string;
  locale?: string;
}

export const clearState = (): IClearState => ({
  type: InitialDataActionTypes.CLEAR_STATE
});

export const receiveInitialData = (data: IInitialData): IReceiveInitialData => ({
  type: InitialDataActionTypes.RECEIVE_INITIAL_DATA,
  data
});

type InitialDataResponse = [AxiosResponse<ICity[]>, AxiosResponse<IType[]>, AxiosResponse<IUser[]>];

export const getInitialData = (params: IGetInitialDataParams = {}) => {
  return (dispatch, getState) => {
    const state: IAppState = getState();
    const locale = params.locale || getLocale(state) || DEFAULT_LANGUAGE;
    const token = state.auth.accessToken;
    const accessTokenClaims = token ? getAccessTokenClaims(token) : null;

    // When page is reloaded we need to set locale
    if (!state.locale) {
      dispatch(setLocale(locale));
    }

    const promises = [
      http.get('/api/cities'),
      http.get('/api/types'),
      http.get('/api/users')
    ];

    return Promise.all(promises)
      .then((response: InitialDataResponse) => {
        const [citiesResponse, typesResponse, usersResponse] = response;
        const cities = getNormalizedData(citiesResponse.data);
        const types = getNormalizedData(typesResponse.data);
        const users = getNormalizedData(usersResponse.data);

        dispatch(receiveInitialData({cities, types, users}));

        if (accessTokenClaims) {
          const { userId: id, userName: name, userRole: role } = accessTokenClaims;
          dispatch(receiveUserDetails({ id, name, role }));
        }
      })
      .catch(console.error);
  };
};
