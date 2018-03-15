import axios from 'axios';
import {
  startLoading,
  endLoading,
  showToast,
} from '../actions';
import { Toast } from '../reducers';
import { DIALOG_LOADER_ID } from '../client-utils';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const loginSuccess = (user) => ({type: LOGIN_SUCCESS, user});
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
      return axios.get(`http://localhost:3000/api/users/profile/${data.userId}`)
        .then(response => response.data)
        .then(user => {
          localStorage.setItem('id_token', data.token);
          dispatch(loginSuccess(user));
          dispatch(endLoading(DIALOG_LOADER_ID));
          dispatch(showToast(Toast.success, 'User logged in successfully'));
        })
        .catch(error => handleLoginError(dispatch, error));
    })
    .catch(error => handleLoginError(dispatch, error));
};

export const logout = () => dispatch => {
  localStorage.removeItem('id_token');
  dispatch(logoutSuccess());
};
