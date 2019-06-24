import { RECEIVE_USER_DETAILS, RECEIVE_ITEMS, LOGOUT_SUCCESS, CLEAR_STATE } from 'actions';

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
