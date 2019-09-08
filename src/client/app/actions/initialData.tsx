import axios from 'axios';
import { getNormalizedData } from 'client-utils/methods';
import { GLOBAL_LOADER_ID } from 'client-utils/constants';
import { setLocale } from 'actions/locale';
import { startLoading, endLoading } from 'actions/loader';
import { receiveUserDetails } from 'actions/currentUser';
import { getAccessTokenClaims, DEFAULT_LANGUAGE } from 'global-utils';
import {
  IAppState,
  ICityState,
  ITypesState,
  IClearState,
  InitialDataActionTypes,
  IInitialData,
  IReceiveInitialData,
  IUsersState
} from 'types';
import { getLocale } from 'selectors';
import { config } from 'config';

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
      axios.get(`${config.host}/api/cities`),
      axios.get(`${config.host}/api/types`),
      axios.get(`${config.host}/api/users`)
    ];

    return axios.all(promises)
      .then(axios.spread((citiesResponse, typesResponse, usersResponse) => {
        const cities: ICityState = getNormalizedData(citiesResponse.data);
        const types: ITypesState = getNormalizedData(typesResponse.data);
        const users: IUsersState = getNormalizedData(usersResponse.data);
        dispatch(receiveInitialData({cities, types, users}));

        if (accessTokenClaims) {
          const { userId: id, userName: name, userRole: role } = accessTokenClaims;
          dispatch(receiveUserDetails({ id, name, role }));
        }

      }))
      .catch(console.error);
  };
};
