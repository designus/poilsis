import axios from 'axios';
import { getNormalizedData, setAcceptLanguageHeader } from 'client-utils/methods';
import { GLOBAL_LOADER_ID } from 'client-utils/constants';
import { IAppState } from 'reducers';
import { setLocale } from 'actions/locale';
import { startLoading, endLoading } from 'actions/loader';
import { receiveUserDetails } from 'actions/currentUser';
import { getAccessTokenClaims, DEFAULT_LANGUAGE } from 'global-utils';
import { getLocale } from 'selectors';
import { config } from '../../../../config';

export const RECEIVE_INITIAL_DATA = 'RECEIVE_INITIAL_DATA';
export const CLEAR_STATE = 'CLEAR_STATE';

export interface IGetInitialDataParams {
  pathName?: string;
  locale?: string;
}

export const clearState = () => ({
  type: CLEAR_STATE
});

export const receiveInitialData = (data) => ({
  type: RECEIVE_INITIAL_DATA,
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
      axios.get(`${config.host}/api/cities`, setAcceptLanguageHeader(locale)),
      axios.get(`${config.host}/api/types`, setAcceptLanguageHeader(locale)),
      axios.get(`${config.host}/api/users`, setAcceptLanguageHeader(locale))
    ];

    return axios.all(promises)
      .then(axios.spread((citiesResponse, typesResponse, usersResponse) => {
        const cities = getNormalizedData(citiesResponse.data);
        const types = getNormalizedData(typesResponse.data);
        const users = getNormalizedData(usersResponse.data);
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
