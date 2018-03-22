import axios from 'axios';
import * as JWT from 'jwt-decode';
import { getNormalizedData } from '../client-utils';

export const RECEIVE_INITIAL_DATA = 'RECEIVE_INITIAL_DATA';
export const RECEIVE_LOGGED_IN_USER = 'RECEIVE_LOGGED_IN_USER';

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

export const getInitialData = () => {
  return (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const decodedToken: any = token ? JWT(token) : null;
    const userId = decodedToken ? decodedToken.userId : null;
    const promises = [
      axios.get('http://localhost:3000/api/cities'),
      axios.get('http://localhost:3000/api/types'),
      ...(userId ?
        [axios.get(`http://localhost:3000/api/users/profile/${userId}`)] :
        [Promise.resolve(null)]
      ),
    ];
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
