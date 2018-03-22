import axios from 'axios';
import * as Cookies from 'js-cookie';
import * as moment from 'moment';
import {
  startLoading,
  endLoading,
  showToast,
} from '../actions';
import { Toast } from '../reducers';
import { DIALOG_LOADER_ID } from '../client-utils';
import * as JWT from 'jwt-decode';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const loginSuccess = (user, token) => ({type: LOGIN_SUCCESS, user, token});
export const logoutSuccess = () => ({type: LOGOUT_SUCCESS});

export const handleLoginError = (dispatch, error) => {
  const response = error.response;
  console.error(response);
  dispatch(endLoading(DIALOG_LOADER_ID));
  dispatch(showToast(Toast.error, `Login failed: ${response.data.message}`));
};

export const login = (credentials = {username: 'admin', password: 'admin'}) => dispatch => {
  dispatch(startLoading(DIALOG_LOADER_ID));

  return axios.post('http://localhost:3000/api/users/login', credentials)
    .then(response => response.data)
    .then(data => {
      const jwt: any = JWT(data.token);
      const {userId, exp} = jwt;
      const expires = moment.unix(exp).utc().toDate();
      return axios.get(`http://localhost:3000/api/users/profile/${userId}`)
        .then(response => response.data)
        .then(user => {
          dispatch(loginSuccess(user, data.token));
          dispatch(endLoading(DIALOG_LOADER_ID));
          dispatch(showToast(Toast.success, 'User logged in successfully'));
          Cookies.set('jwt', data.token, {expires});
        })
        .catch(error => handleLoginError(dispatch, error));
    })
    .catch(error => handleLoginError(dispatch, error));
};

export const logout = () => dispatch => {
  Cookies.remove('jwt');
  dispatch(logoutSuccess());
};
