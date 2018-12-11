import axios from 'axios';
import { getNormalizedData, setAcceptLanguageHeader, GLOBAL_LOADER_ID } from 'client-utils';
import { IAppState } from 'reducers';
import { receiveUserDetails, startLoading } from 'actions';
import { getAccessTokenClaims } from 'global-utils';
import { getLocale } from 'selectors';

export const RECEIVE_INITIAL_DATA = 'RECEIVE_INITIAL_DATA';
export const CLEAR_STATE = 'CLEAR_STATE';

export const clearState = () => ({
  type: CLEAR_STATE,
});

export const receiveInitialData = (data) => ({
  type: RECEIVE_INITIAL_DATA,
  data,
});

export const getInitialData = () => {
  return (dispatch, getState) => {
    // Loader will stopped by components that load additional data
    dispatch(startLoading(GLOBAL_LOADER_ID));
    const state: IAppState = getState();
    const locale = getLocale(state);
    const token = state.auth.accessToken;
    const accessTokenClaims = token ? getAccessTokenClaims(token) : null;
    const promises = [
      axios.get('http://localhost:3000/api/cities', setAcceptLanguageHeader(locale)),
      axios.get('http://localhost:3000/api/types', setAcceptLanguageHeader(locale)),
      axios.get('http://localhost:3000/api/users'),
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
      }))
      .catch(console.error);
  };
};
