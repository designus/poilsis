import axios from 'axios';
import { getNormalizedData, setAcceptLanguageHeader, GLOBAL_LOADER_ID } from 'client-utils';
import { IAppState } from 'reducers';
import { receiveUserDetails, startLoading, endLoading, setLocale } from 'actions';
import { getAccessTokenClaims, DEFAULT_LANGUAGE } from 'global-utils';

export const RECEIVE_INITIAL_DATA = 'RECEIVE_INITIAL_DATA';
export const CLEAR_STATE = 'CLEAR_STATE';

export interface IGetInitialDataParams {
  pathName?: string;
  locale?: string;
}

export const clearState = () => ({
  type: CLEAR_STATE,
});

export const receiveInitialData = (data) => ({
  type: RECEIVE_INITIAL_DATA,
  data,
});

const shouldStopLoader = (pathName: string) => pathName ?
  ['cities', 'types', 'users'].some(str => pathName.includes(str)) :
  true;

export const getInitialData = (params: IGetInitialDataParams = {}) => {
  return (dispatch, getState) => {
    const state: IAppState = getState();
    const locale = params.locale || DEFAULT_LANGUAGE;
    const token = state.auth.accessToken;
    const accessTokenClaims = token ? getAccessTokenClaims(token) : null;

    // Loader will only be stopped if no additional data has to be loaded in child components
    dispatch(startLoading(GLOBAL_LOADER_ID));
    dispatch(setLocale(locale));

    const promises = [
      axios.get('http://localhost:3000/api/cities', setAcceptLanguageHeader(locale)),
      axios.get('http://localhost:3000/api/types', setAcceptLanguageHeader(locale)),
      axios.get('http://localhost:3000/api/users', setAcceptLanguageHeader(locale)),
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
