import axios from 'axios';
import { getNormalizedData, setAcceptLanguageHeader } from 'client-utils';
import { IAppState } from 'reducers';
import { receiveUserDetails, loginSuccess } from 'actions';
import { getAccessTokenClaims } from 'global-utils';

export const RECEIVE_INITIAL_DATA = 'RECEIVE_INITIAL_DATA';

export const receiveInitialData = (data) => ({
  type: RECEIVE_INITIAL_DATA,
  data,
});

export const getInitialData = () => {
  return (dispatch, getState) => {
    const state: IAppState = getState();
    const token = state.auth.accessToken;
    const accessTokenClaims = token ? getAccessTokenClaims(token) : null;
    const userId = accessTokenClaims ? accessTokenClaims.userId : null;
    const promises = [
      axios.get('http://localhost:3000/api/cities', setAcceptLanguageHeader()),
      axios.get('http://localhost:3000/api/types', setAcceptLanguageHeader()),
      axios.get('http://localhost:3000/api/users'),
    ];

    if (userId) {
      promises.push(axios.get(`http://localhost:3000/api/users/profile/${userId}`));
    }

    return axios.all(promises)
      .then(axios.spread((citiesResponse, typesResponse, usersResponse, loggedInUser) => {
        const cities = getNormalizedData(citiesResponse.data);
        const types = getNormalizedData(typesResponse.data);
        const users = getNormalizedData(usersResponse.data);
        dispatch(receiveInitialData({cities, types, users}));

        if (loggedInUser) {
          dispatch(loginSuccess(token));
          dispatch(receiveUserDetails(loggedInUser.data));
        }
      }))
      .catch(console.error);
  };
};
