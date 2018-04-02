import { LOGIN_SUCCESS, LOGOUT_SUCCESS, RECEIVE_LOGGED_IN_USER, SET_ACCESS_TOKEN } from '../actions';

export interface IUser {
  name: string;
  role: string;
}

export interface IAuthState {
  isLoggedIn: boolean;
  user: IUser;
  accessToken: string;
}

export const auth = (state: IAuthState = {isLoggedIn: false, user: null, accessToken: null}, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        user: action.user,
        accessToken: action.accessToken,
        isLoggedIn: true,
      };
    }
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        user: null,
        accessToken: null,
        isLoggedIn: false,
      };
    }
    case RECEIVE_LOGGED_IN_USER: {
      return {
        ...state,
        user: action.user,
        isLoggedIn: true,
      };
    }
    /* During page reload we extract accessToken from cookies and put it into our state. After this we make
    additional request to get user profile data in getInitialData method call */
    case SET_ACCESS_TOKEN: {
      return {
        ...state,
        accessToken: action.accessToken,
        user: null,
        isLoggedIn: false,
      };
    }
    default:
      return state;
  }
};
