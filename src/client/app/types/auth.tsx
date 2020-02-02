export interface IAuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  showKeepMeLoggedModal: boolean;
}

export enum AuthActionTypes {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  SHOW_KEEP_ME_LOGGED_MODAL = 'SHOW_KEEP_ME_LOGGED_MODAL',
  REAUTHENTICATE_SUCCESS = 'REAUTHENTICATE_SUCCESS',
  SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
}

export interface ILoginSucces {
  type: AuthActionTypes.LOGIN_SUCCESS;
  accessToken: string;
}

export interface ILogoutSuccess {
  type: AuthActionTypes.LOGOUT_SUCCESS;
}

export interface IShowKeepMeLoggedModal {
  type: AuthActionTypes.SHOW_KEEP_ME_LOGGED_MODAL;
}

export interface IReauthenticateSuccess {
  type: AuthActionTypes.REAUTHENTICATE_SUCCESS;
  accessToken: string;
}

export interface ISetAccessToken {
  type: AuthActionTypes.SET_ACCESS_TOKEN;
  accessToken: string;
}

export type AuthActions =
  | ILoginSucces
  | ILogoutSuccess
  | IShowKeepMeLoggedModal
  | IReauthenticateSuccess
  | ISetAccessToken;
