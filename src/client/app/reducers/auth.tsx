import { Reducer } from 'redux';
import { IAuthState, AuthActionTypes, AuthActions } from 'types';

const initialAuthState: IAuthState = {
  isLoggedIn: false,
  accessToken: null,
  showKeepMeLoggedModal: false
};

export const auth: Reducer<IAuthState, AuthActions> = (state: IAuthState = initialAuthState, action): IAuthState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        accessToken: action.accessToken,
        isLoggedIn: true,
        showKeepMeLoggedModal: false
      };
    }
    case AuthActionTypes.LOGOUT_SUCCESS: {
      return {
        ...state,
        accessToken: null,
        isLoggedIn: false,
        showKeepMeLoggedModal: false
      };
    }
    case AuthActionTypes.REAUTHENTICATE_SUCCESS: {
      return {
        ...state,
        accessToken: action.accessToken,
        showKeepMeLoggedModal: false
      };
    }
    /* During page reload we extract accessToken from cookies and put it into our state. After this we make
    additional request to get user profile data in getInitialData method call */
    case AuthActionTypes.SET_ACCESS_TOKEN: {
      return {
        ...state,
        accessToken: action.accessToken,
        isLoggedIn: false
      };
    }
    case AuthActionTypes.SHOW_KEEP_ME_LOGGED_MODAL: {
      return {
        ...state,
        showKeepMeLoggedModal: true
      };
    }
    default:
      return state;
  }
};
