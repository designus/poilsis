import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../actions';

export interface IUser {
  name: string;
  role: string;
}

export interface IAuthState {
  isLoggedIn: boolean;
  user: IUser;
}

export const auth = (state: IAuthState = {isLoggedIn: false, user: null}, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return {
        ...state,
        user: action.user,
        isLoggedIn: true,
      };
    }
    case LOGOUT_SUCCESS: {
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    }
    default:
      return state;
  }
};
