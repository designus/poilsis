import { batch } from 'react-redux';
import * as Cookies from 'js-cookie';
import * as day from 'dayjs';

import { showLoader, hideLoader } from 'actions/loader';
import { showToast } from 'actions/toast';
import { receiveUserDetails } from 'actions/currentUser';
import { DIALOG_LOADER_ID } from 'client-utils/constants';
import { getUserDetails } from 'client-utils/methods';
import { getAccessTokenClaims } from 'global-utils/methods';
import { getAccessToken } from 'selectors';
import {
  AuthActionTypes,
  Toast,
  ThunkResult,
  ThunkDispatch,
  Credentials
} from 'types';

import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_ERROR,
  USER_REAUTHENTICATE_SUCCESS
} from 'data-strings';
import { http } from './utils';

export const loginSuccess = (accessToken: string) => ({
  type: AuthActionTypes.LOGIN_SUCCESS,
  accessToken
}) as const;

export const logoutSuccess = () => ({
  type: AuthActionTypes.LOGOUT_SUCCESS
}) as const;

export const showKeepMeLoggedModal = () => ({
  type: AuthActionTypes.SHOW_KEEP_ME_LOGGED_MODAL
}) as const;

export const reauthenticateSuccess = (accessToken: string) => ({
  type: AuthActionTypes.REAUTHENTICATE_SUCCESS,
  accessToken
}) as const;

export const setAccessToken = (accessToken: string) => ({
  type: AuthActionTypes.SET_ACCESS_TOKEN,
  accessToken
}) as const;

export const handleAuthError = (dispatch: ThunkDispatch, isLogin: boolean) => (error: any) => {
  const genericMessage = isLogin ? USER_LOGIN_ERROR : USER_LOGOUT_ERROR;
  const errorMessage = error.response.data.message;
  console.error(error);
  dispatch(hideLoader(DIALOG_LOADER_ID));
  dispatch(showToast(Toast.error, genericMessage, errorMessage));
  dispatch(logout());
};

export const login = (credentials: Credentials): ThunkResult<Promise<void>> => dispatch => {
  dispatch(showLoader(DIALOG_LOADER_ID));
  return http.post('/api/users/login', credentials)
    .then(response => response.data)
    .then(data => {
      const { accessToken, refreshToken } = data;
      const accessTokenClaims = getAccessTokenClaims(accessToken);
      const expiryDate = day(accessTokenClaims.exp * 1000).toDate();
      batch(() => {
        dispatch(loginSuccess(accessToken));
        dispatch(receiveUserDetails(getUserDetails(accessTokenClaims)));
        dispatch(hideLoader(DIALOG_LOADER_ID));
        dispatch(showToast(Toast.success, USER_LOGIN_SUCCESS));
      });

      Cookies.set('jwt', accessToken, {expires: expiryDate});
      localStorage.setItem('refreshToken', refreshToken);
      return Promise.resolve();
    })
    .catch(handleAuthError(dispatch, true));
};

export const reauthenticateUser = (displayToast = false): ThunkResult<Promise<void> | null> => (dispatch, getState) => {
  dispatch(showLoader(DIALOG_LOADER_ID));
  const state = getState();
  const oldAccessToken = getAccessToken(state);
  const refreshToken = localStorage.getItem('refreshToken');

  if (!oldAccessToken) return null;

  const dataToSend = {...getAccessTokenClaims(oldAccessToken), refreshToken };
  return http.post('/api/users/reauthenticate', dataToSend)
    .then(response => response.data)
    .then((data) => {
      const accessToken = data.accessToken;
      const { exp } = getAccessTokenClaims(accessToken);
      const expiryDate = day(exp * 1000).toDate();
      dispatch(hideLoader(DIALOG_LOADER_ID));
      dispatch(reauthenticateSuccess(accessToken));
      Cookies.set('jwt', accessToken, { expires: expiryDate });
      if (displayToast) {
        dispatch(showToast(Toast.success, USER_REAUTHENTICATE_SUCCESS));
      }
    })
    .catch(handleAuthError(dispatch, true));
};

export const logout = (): ThunkResult<Promise<void> | null> => (dispatch, getState) => {
  const state = getState();
  const accessToken = getAccessToken(state);

  if (!accessToken) return null;

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
