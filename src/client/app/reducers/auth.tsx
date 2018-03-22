import { LOGIN_SUCCESS, LOGOUT_SUCCESS, RECEIVE_LOGGED_IN_USER } from '../actions';

export interface IUser {
  name: string;
  role: string;
}

export interface IAuthState {
  isLoggedIn: boolean;
  user: IUser;
  token: string;
}

export const auth = (state: IAuthState = {isLoggedIn: false, user: null, token: null}, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        user: action.user,
        token: action.token,
        isLoggedIn: true,
      };
    }
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        user: null,
        token: null,
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
    default:
      return state;
  }
};
