import axios from 'axios';
import * as JWT from 'jwt-decode';
import { getNormalizedData } from '../client-utils';
import { IAppState } from '../reducers';

export const RECEIVE_INITIAL_DATA = 'RECEIVE_INITIAL_DATA';
export const RECEIVE_LOGGED_IN_USER = 'RECEIVE_LOGGED_IN_USER';
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';

export const receiveInitialData = (data) => {
  return {
    type: RECEIVE_INITIAL_DATA,
    data,
  };
};

export const receiveLoggedInUser = (user) => {
  return {
    type: RECEIVE_LOGGED_IN_USER,
    user,
  };
};

export const setAccessToken = (accessToken) => {
  return {
    type: SET_ACCESS_TOKEN,
    accessToken,
  };
};

export const getInitialData = () => {
  return (dispatch, getState) => {
    const state: IAppState = getState();
    const token = state.auth.accessToken;
    const decodedToken: any = token ? JWT(token) : null;
    const userId = decodedToken ? decodedToken.userId : null;
    const promises = [
      axios.get('http://localhost:3000/api/cities'),
      axios.get('http://localhost:3000/api/types'),
    ];

    if (userId) {
      promises.push(axios.get(`http://localhost:3000/api/users/profile/${userId}`));
    }

    return axios.all(promises)
      .then(axios.spread((citiesResponse, typesResponse, userResponse) => {
        const cities = getNormalizedData(citiesResponse.data);
        const types = getNormalizedData(typesResponse.data);
        dispatch(receiveInitialData({cities, types}));
        if (userResponse) {
          dispatch(receiveLoggedInUser(userResponse.data));
        }
      }))
      .catch(err => {
        console.error(err);
      });
  };
};
