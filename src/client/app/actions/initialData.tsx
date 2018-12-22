import axios from 'axios';
import { getNormalizedData, setAcceptLanguageHeader, GLOBAL_LOADER_ID } from 'client-utils';
import { IAppState } from 'reducers';
import { receiveUserDetails, startLoading, endLoading } from 'actions';
import { getAccessTokenClaims } from 'global-utils';
import { getLocale } from 'selectors';

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
    // Loader will only be stopped if no additional data has to be loaded in child components
    dispatch(startLoading(GLOBAL_LOADER_ID));
    const state: IAppState = getState();
    const locale = params.locale || getLocale(state);
    const token = state.auth.accessToken;
    const accessTokenClaims = token ? getAccessTokenClaims(token) : null;
    console.log('Getting initial data with locale:', locale);
    const promises = [
      axios.get('http://localhost:3000/api/cities', setAcceptLanguageHeader(locale)),
      axios.get('http://localhost:3000/api/types', setAcceptLanguageHeader(locale)),
      axios.get('http://localhost:3000/api/users', setAcceptLanguageHeader(locale)),
    ];

    return axios.all(promises)
      .then(axios.spread((citiesResponse, typesResponse, usersResponse) => {
        // console.log('Cities response', citiesResponse.data);
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
