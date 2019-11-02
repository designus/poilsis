import axios from 'axios';
import * as Cookies from 'js-cookie';
import * as day from 'dayjs';

import { startLoading, endLoading } from 'actions/loader';
import { showToast } from 'actions/toast';
import { receiveUserDetails } from 'actions/currentUser';
import { DIALOG_LOADER_ID } from 'client-utils/constants';
import { getAccessTokenClaims } from 'global-utils/methods';
import {
  IAppState,
  AuthActionTypes,
  ILoginSucces,
  ILogoutSuccess,
  IShowKeepMeLoggedModal,
  IReauthenticateSuccess,
  ISetAccessToken,
  Toast
} from 'types';

import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_ERROR,
  USER_REAUTHENTICATE_SUCCESS
} from 'data-strings';
import { http } from './utils';

export const loginSuccess = (accessToken: string): ILoginSucces => ({
  type: AuthActionTypes.LOGIN_SUCCESS,
  accessToken
});

export const logoutSuccess = (): ILogoutSuccess => ({
  type: AuthActionTypes.LOGOUT_SUCCESS
});

export const showKeepMeLoggedModal = (): IShowKeepMeLoggedModal => ({
  type: AuthActionTypes.SHOW_KEEP_ME_LOGGED_MODAL
});

export const reauthenticateSuccess = (accessToken: string): IReauthenticateSuccess => ({
  type: AuthActionTypes.REAUTHENTICATE_SUCCESS,
  accessToken
});

export const setAccessToken = (accessToken: string): ISetAccessToken => ({
  type: AuthActionTypes.SET_ACCESS_TOKEN,
  accessToken
});

export const handleAuthError = (dispatch, isLogin: boolean) => (error) => {
  const genericMessage = isLogin ? USER_LOGIN_ERROR : USER_LOGOUT_ERROR;
  const errorMessage = error.response.data.message;
  console.error(error);
  dispatch(endLoading(DIALOG_LOADER_ID));
  dispatch(showToast(Toast.error, genericMessage, errorMessage));
  dispatch(logout());
};

export const login = (credentials = {username: 'admin', password: 'admin'}) => dispatch => {
  dispatch(startLoading(DIALOG_LOADER_ID));
  return http.post('/api/users/login', credentials)
    .then(response => response.data)
    .then(data => {
      const { accessToken, refreshToken } = data;
      const { userId: id, exp, userName: name, userRole: role } = getAccessTokenClaims(accessToken);
      const expiryDate = day(exp * 1000).toDate();
      dispatch(loginSuccess(accessToken));
      dispatch(receiveUserDetails({ id, name, role }));
      dispatch(endLoading(DIALOG_LOADER_ID));
      dispatch(showToast(Toast.success, USER_LOGIN_SUCCESS));
      Cookies.set('jwt', accessToken, {expires: expiryDate});
      localStorage.setItem('refreshToken', refreshToken);
      return Promise.resolve();
    })
    .catch(handleAuthError(dispatch, true));
};

export const reauthenticateUser = (displayToast = false) => (dispatch, getState) => {
  dispatch(startLoading(DIALOG_LOADER_ID));
  const state: IAppState = getState();
  const oldAccessToken = state.auth.accessToken;
  const refreshToken = localStorage.getItem('refreshToken');
  const dataToSend = {...getAccessTokenClaims(oldAccessToken), refreshToken };
  return http.post('/api/users/reauthenticate', dataToSend)
    .then(response => response.data)
    .then((data) => {
      const accessToken = data.accessToken;
      const { exp } = getAccessTokenClaims(accessToken);
      const expiryDate = day(exp * 1000).toDate();
      dispatch(endLoading(DIALOG_LOADER_ID));
      dispatch(reauthenticateSuccess(accessToken));
      Cookies.set('jwt', accessToken, { expires: expiryDate });
      if (displayToast) {
        dispatch(showToast(Toast.success, USER_REAUTHENTICATE_SUCCESS));
      }
    })
    .catch(handleAuthError(dispatch, true));
};

export const logout = () => (dispatch, getState) => {
  const state: IAppState = getState();
  const accessToken = state.auth.accessToken;
  const { userId } = getAccessTokenClaims(accessToken);
  return http.delete(`/api/users/logout/${userId}`)
    .then(response => response.data)
    .then(() => {
      Cookies.remove('jwt');
      localStorage.removeItem('refreshToken');
      dispatch(logoutSuccess());
      dispatch(showToast(Toast.success, USER_LOGOUT_SUCCESS));
      dispatch(receiveUserDetails(null));
    })
    .catch(handleAuthError(dispatch, false));
};
