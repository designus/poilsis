import axios from 'axios';
import * as Cookies from 'js-cookie';
import * as day from 'dayjs';

import { startLoading, endLoading, showToast, receiveUserDetails } from 'actions';
import { Toast, IAppState, IUser } from 'reducers';
import { DIALOG_LOADER_ID } from 'client-utils';
import { REAUTHENTICATE_DURATION_SECONDS, getAccessTokenClaims } from 'global-utils';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const SET_AUTH_TIMEOUT_ID = 'SET_AUTH_TIMEOUT_ID';
export const SHOW_KEEP_ME_LOGGED_MODAL = 'SHOW_KEEP_ME_LOGGED_MODAL';
export const REAUTHENTICATE_SUCCESS = 'REAUTHENTICATE_SUCCESS';
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';

export const loginSuccess = (accessToken) => ({type: LOGIN_SUCCESS, accessToken});
export const logoutSuccess = () => ({type: LOGOUT_SUCCESS});
export const setAuthTimeoutId = (timeoutId) => ({type: SET_AUTH_TIMEOUT_ID, timeoutId});
export const showKeepMeLoggedModal = (time) => ({type: SHOW_KEEP_ME_LOGGED_MODAL, time});
export const reauthenticateSuccess = (accessToken) => ({type: REAUTHENTICATE_SUCCESS, accessToken});
export const setAccessToken = (accessToken) => ({type: SET_ACCESS_TOKEN, accessToken});

export const handleError = (dispatch, error, isLogin: boolean) => {
  const response = error.response;
  const errorType = isLogin ? 'Login failed' : 'Logout failed';
  console.error(response);
  dispatch(endLoading(DIALOG_LOADER_ID));
  dispatch(showToast(Toast.error, `${errorType}: ${response.data.message}`));
  dispatch(logout());
};

export const getKeepMeLoggedModalDelay = (expires, timeInSeconds) => {
  const now = day().unix();
  const delayBuffer = 1;
  const delayCandidate = expires - delayBuffer - timeInSeconds - now;
  const delay = delayCandidate > 0 ? delayCandidate : expires - now;
  return delay;
};

export const setLogoutTimer = (expires: number) => (dispatch, getState) => {
  const state: IAppState = getState();
  const timeoutId: number = state.auth.timeoutId;
  const delayInSeconds = getKeepMeLoggedModalDelay(expires, REAUTHENTICATE_DURATION_SECONDS);

  if (timeoutId) clearTimeout(timeoutId);

  const newTimeoutId = setTimeout(() =>
    dispatch(showKeepMeLoggedModal(REAUTHENTICATE_DURATION_SECONDS)), delayInSeconds * 1000,
  );

  dispatch(setAuthTimeoutId(newTimeoutId));
};

export const login = (credentials = {username: 'admin', password: 'admin'}) => dispatch => {
  dispatch(startLoading(DIALOG_LOADER_ID));
  return axios.post('http://localhost:3000/api/users/login', credentials)
    .then(response => response.data)
    .then(data => {
      const { accessToken, refreshToken } = data;
      const { userId, expires } = getAccessTokenClaims(accessToken);
      const expiryDate = day(expires * 1000).toDate();
      return axios.get(`http://localhost:3000/api/users/profile/${userId}`)
        .then(response => response.data)
        .then((user: IUser) => {
          dispatch(loginSuccess(accessToken));
          dispatch(receiveUserDetails(user));
          dispatch(endLoading(DIALOG_LOADER_ID));
          dispatch(showToast(Toast.success, 'User logged in successfully'));
          dispatch(setLogoutTimer(expires));
          Cookies.set('jwt', accessToken, {expires: expiryDate});
          localStorage.setItem('refreshToken', refreshToken);
          return Promise.resolve();
        })
        .catch(error => handleError(dispatch, error, true));
    })
    .catch(error => handleError(dispatch, error, true));
};

export const reauthenticateUser = () => (dispatch, getState) => {
  dispatch(startLoading(DIALOG_LOADER_ID));
  const state: IAppState = getState();
  const oldAccessToken = state.auth.accessToken;
  const refreshToken = localStorage.getItem('refreshToken');
  const { userId, userRole } = getAccessTokenClaims(oldAccessToken);
  return axios.post('http://localhost:3000/api/users/reauthenticate', { userId, userRole, refreshToken })
    .then(response => response.data)
    .then((data) => {
      const accessToken = data.accessToken;
      const { expires } = getAccessTokenClaims(accessToken);
      const expiryDate = day(expires * 1000).toDate();
      dispatch(endLoading(DIALOG_LOADER_ID));
      dispatch(showToast(Toast.success, 'User reauthenticated successfully'));
      dispatch(reauthenticateSuccess(accessToken));
      dispatch(setLogoutTimer(expires));
      Cookies.set('jwt', accessToken, { expires: expiryDate });
    })
    .catch(error => handleError(dispatch, error, true));
};

export const logout = () => (dispatch, getState) => {
  const state: IAppState = getState();
  const accessToken = state.auth.accessToken;
  const { userId } = getAccessTokenClaims(accessToken);
  return axios.delete(`http://localhost:3000/api/users/logout/${userId}`)
    .then(response => response.data)
    .then(() => {
      Cookies.remove('jwt');
      localStorage.removeItem('refreshToken');
      dispatch(logoutSuccess());
      dispatch(receiveUserDetails(null));
    })
    .catch(error => handleError(dispatch, error, false));
};
