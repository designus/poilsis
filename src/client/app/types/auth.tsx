import { loginSuccess, logoutSuccess, showKeepMeLoggedModal, reauthenticateSuccess, setAccessToken } from 'actions/auth';

export interface IAuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  showKeepMeLoggedModal: boolean;
}

export type Credentials = {
  username: string;
  password: string;
};

export enum AuthActionTypes {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  SHOW_KEEP_ME_LOGGED_MODAL = 'SHOW_KEEP_ME_LOGGED_MODAL',
  REAUTHENTICATE_SUCCESS = 'REAUTHENTICATE_SUCCESS',
  SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
}

export type AuthActions =
  | ReturnType<typeof loginSuccess>
  | ReturnType<typeof logoutSuccess>
  | ReturnType<typeof showKeepMeLoggedModal>
  | ReturnType<typeof reauthenticateSuccess>
  | ReturnType<typeof setAccessToken>;
