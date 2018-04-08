import axios from 'axios';
import * as Cookies from 'js-cookie';
import * as moment from 'moment';
import * as JWT from 'jwt-decode';
import { startLoading, endLoading, showToast } from '../actions';
import { Toast, IAppState } from '../reducers';
import { DIALOG_LOADER_ID } from '../client-utils';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const SET_AUTH_TIMEOUT_ID = 'SET_AUTH_TIMEOUT_ID';
export const SHOW_KEEP_ME_LOGGED_MODAL = 'SHOW_KEEP_ME_LOGGED_MODAL';

export const loginSuccess = (user, accessToken) => ({type: LOGIN_SUCCESS, user, accessToken});
export const logoutSuccess = () => ({type: LOGOUT_SUCCESS});
export const setAuthTimeoutId = (timeoutId) => ({type: SET_AUTH_TIMEOUT_ID, timeoutId});
export const showKeepMeLoggedModal = (time) => ({type: SHOW_KEEP_ME_LOGGED_MODAL, time});

export const handleError = (dispatch, error, isLogin: boolean) => {
  const response = error.response;
  const errorType = isLogin ? 'Login failed' : 'Logout failed';
  console.error(response);
  dispatch(endLoading(DIALOG_LOADER_ID));
  dispatch(showToast(Toast.error, `${errorType}: ${response.data.message}`));
};

export const getKeepMeLoggedModalDelay = (expires, timeInSeconds) => {
  const now = moment().utc().unix();
  const delayBuffer = 10;
  const delayCandidate = expires - delayBuffer - timeInSeconds - now;
  const delay = delayCandidate > 0 ? delayCandidate : expires - now;
  return delay;
};

export const initiateExpiredLoginNotification = (expires: number) => (dispatch, getState) => {
  const state: IAppState = getState();
  const timeInSeconds = 30;
  const timeoutId = state.auth.timeoutId;
  const delayInSeconds = getKeepMeLoggedModalDelay(expires, timeInSeconds);
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  const newTimeoutId = setTimeout(() => dispatch(showKeepMeLoggedModal(timeInSeconds)), delayInSeconds * 1000);
  dispatch(setAuthTimeoutId(newTimeoutId));
};

export const login = (credentials = {username: 'admin', password: 'admin'}) => dispatch => {
  dispatch(startLoading(DIALOG_LOADER_ID));

  return axios.post('http://localhost:3000/api/users/login', credentials)
    .then(response => response.data)
    .then(data => {
      const { accessToken, refreshToken } = data;
      const jwt: any = JWT(accessToken);
      const {userId, exp} = jwt;
      const expires = moment.unix(exp).utc().toDate();

      return axios.get(`http://localhost:3000/api/users/profile/${userId}`)
        .then(response => response.data)
        .then(user => {
          console.log('User', user);
          dispatch(loginSuccess(user, accessToken));
          dispatch(endLoading(DIALOG_LOADER_ID));
          dispatch(showToast(Toast.success, 'User logged in successfully'));
          dispatch(initiateExpiredLoginNotification(exp));
          Cookies.set('jwt', accessToken, {expires});
          localStorage.setItem('refreshToken', refreshToken);
        })
        .catch(error => handleError(dispatch, error, true));
    })
    .catch(error => handleError(dispatch, error, true));
};

export const logout = () => (dispatch, getState) => {
  const state: IAppState = getState();
  const accessToken = state.auth.accessToken;
  const {userId} = JWT(accessToken);
  return axios.delete(`http://localhost:3000/api/tokens/${userId}`)
    .then(response => response.data)
    .then(() => {
      Cookies.remove('jwt');
      localStorage.removeItem('refreshToken');
      dispatch(logoutSuccess());
    })
    .catch(error => handleError(dispatch, error, false));
};
