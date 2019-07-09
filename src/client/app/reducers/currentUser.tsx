import { RECEIVE_USER_DETAILS } from 'actions/currentUser';
import { CLEAR_STATE } from 'actions/initialData';
import { LOGOUT_SUCCESS } from 'actions/auth';
import { RECEIVE_ITEMS } from 'actions/items';

export interface ICurrentUser {
  name?: string;
  role?: string;
  id?: string;
}

export interface ICurrentUserState {
  details: ICurrentUser;
  hasItems?: boolean;
}

const getInitialState = () => ({
  details: {},
  hasItems: false
});

export const currentUser = (state: ICurrentUserState = getInitialState(), action): ICurrentUserState => {
  switch (action.type) {
    case RECEIVE_ITEMS:
      return action.userId ? { ...state, hasItems: true } : state;
    case RECEIVE_USER_DETAILS: {
      return {
        ...state,
        details: action.userDetails
      };
    }
    case CLEAR_STATE:
      return {
        ...state,
        hasItems: false
      };
    case LOGOUT_SUCCESS: {
      return getInitialState();
    }
    default:
      return state;
  }
};
