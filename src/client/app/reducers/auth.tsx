import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  SET_ACCESS_TOKEN,
  SHOW_KEEP_ME_LOGGED_MODAL,
  REAUTHENTICATE_SUCCESS,
} from '../actions';

export interface IAuthState {
  isLoggedIn: boolean;
  accessToken: string;
  showKeepMeLoggedModal?: boolean;
}

const initialAuthState: IAuthState = {
  isLoggedIn: false,
  accessToken: null,
  showKeepMeLoggedModal: false,
};

export const auth = (state: IAuthState = initialAuthState, action): IAuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        accessToken: action.accessToken,
        isLoggedIn: true,
        showKeepMeLoggedModal: false,
      };
    }
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        accessToken: null,
        isLoggedIn: false,
        showKeepMeLoggedModal: false,
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
        isLoggedIn: false,
      };
    }
    case SHOW_KEEP_ME_LOGGED_MODAL: {
      return {
        ...state,
        showKeepMeLoggedModal: true,
      };
    }
    default:
      return state;
  }
};
