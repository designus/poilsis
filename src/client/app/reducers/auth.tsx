import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  SET_ACCESS_TOKEN,
  SET_AUTH_TIMEOUT_ID,
  SHOW_KEEP_ME_LOGGED_MODAL,
  REAUTHENTICATE_SUCCESS,
} from '../actions';

export interface IAuthState {
  isLoggedIn: boolean;
  accessToken: string;
  timeoutId?: number;
  showKeepMeLoggedModal?: boolean;
  timeToCloseModal?: number;
}

export const auth = (state: IAuthState = {
  isLoggedIn: false,
  accessToken: null,
  showKeepMeLoggedModal: false,
  timeToCloseModal: 0,
  timeoutId: null,
}, action): IAuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        accessToken: action.accessToken,
        isLoggedIn: true,
        showKeepMeLoggedModal: false,
        timeToCloseModal: null,
      };
    }
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        // user: null,
        accessToken: null,
        isLoggedIn: false,
        showKeepMeLoggedModal: false,
        timeToCloseModal: null,
      };
    }
    case REAUTHENTICATE_SUCCESS: {
      return {
        ...state,
        accessToken: action.accessToken,
        showKeepMeLoggedModal: false,
      };
    }
    /* During page reload we extract accessToken from cookies and put it into our state. After this we make
    additional request to get user profile data in getInitialData method call */
    case SET_ACCESS_TOKEN: {
      return {
        ...state,
        accessToken: action.accessToken,
        // user: null,
        isLoggedIn: false,
      };
    }
    case SET_AUTH_TIMEOUT_ID: {
      return {
        ...state,
        timeoutId: action.timeoutId,
      };
    }
    case SHOW_KEEP_ME_LOGGED_MODAL: {
      return {
        ...state,
        showKeepMeLoggedModal: true,
        timeToCloseModal: action.time,
      };
    }
    default:
      return state;
  }
};
