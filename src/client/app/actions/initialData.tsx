import { AxiosResponse } from 'axios';
import { getNormalizedData } from 'client-utils/methods';
import { setClientLocale } from 'actions/locale';
import { receiveUserDetails } from 'actions/currentUser';
import { getAccessTokenClaims, DEFAULT_LANGUAGE, ICity, IType, IUser, Languages } from 'global-utils';
import {
  IAppState,
  InitialDataActionTypes,
  IInitialData,
  IReceiveInitialData
} from 'types';
import { getClientLocale } from 'selectors';
import { http } from './utils';

export interface IGetInitialDataParams {
  pathName?: string;
  locale?: Languages;
}

export const receiveInitialData = (data: IInitialData): IReceiveInitialData => ({
  type: InitialDataActionTypes.RECEIVE_INITIAL_DATA,
  data
});

type InitialDataResponse = [AxiosResponse<ICity[]>, AxiosResponse<IType[]>, AxiosResponse<IUser[]>];

export const getInitialData = (params: IGetInitialDataParams = {}) => {
  return (dispatch, getState) => {
    const state: IAppState = getState();
    const locale = params.locale || getClientLocale(state) || DEFAULT_LANGUAGE;
    const token = state.auth.accessToken;
    const accessTokenClaims = token ? getAccessTokenClaims(token) : null;

    dispatch(setClientLocale(locale));

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
