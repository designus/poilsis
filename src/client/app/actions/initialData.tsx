import axios from 'axios';
import { getNormalizedData } from 'client-utils/methods';
import { GLOBAL_LOADER_ID } from 'client-utils/constants';
import { IAppState, ITypesState, IUsersState } from 'reducers';
import { setLocale } from 'actions/locale';
import { startLoading, endLoading } from 'actions/loader';
import { receiveUserDetails } from 'actions/currentUser';
import { getAccessTokenClaims, DEFAULT_LANGUAGE } from 'global-utils';
import { ICityState } from 'types';
import { getLocale } from 'selectors';
import { config } from '../../../../config';

export interface IGetInitialDataParams {
  pathName?: string;
  locale?: string;
}

export enum InitialDataActionTypes {
  RECEIVE_INITIAL_DATA = 'RECEIVE_INITIAL_DATA',
  CLEAR_STATE = 'CLEAR_STATE'
}

interface IInitialDataState {
  cities: ICityState;
  types: ITypesState;
  users: IUsersState;
}

interface IClearState {
  type: InitialDataActionTypes.CLEAR_STATE;
}

interface IReceiveInitialData {
  type: InitialDataActionTypes.RECEIVE_INITIAL_DATA;
  data: IInitialDataState;
}

export type InitialDataActions = IClearState | IReceiveInitialData;

export const clearState = (): IClearState => ({
  type: InitialDataActionTypes.CLEAR_STATE
});

export const receiveInitialData = (data: IInitialDataState): IReceiveInitialData => ({
  type: InitialDataActionTypes.RECEIVE_INITIAL_DATA,
  data
});

// Loader will only be stopped if no additional data has to be loaded in child components
const shouldStopLoader = (pathName: string) => pathName ?
  ['cities', 'types', 'users'].some(str => pathName.includes(str)) :
  true;

export const getInitialData = (params: IGetInitialDataParams = {}) => {
  return (dispatch, getState) => {
    const state: IAppState = getState();
    const locale = params.locale || getLocale(state) || DEFAULT_LANGUAGE;
    const token = state.auth.accessToken;
    const accessTokenClaims = token ? getAccessTokenClaims(token) : null;

    dispatch(startLoading(GLOBAL_LOADER_ID));

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

        if (shouldStopLoader(params.pathName)) {
          dispatch(endLoading());
        }

      }))
      .catch(console.error);
  };
};
