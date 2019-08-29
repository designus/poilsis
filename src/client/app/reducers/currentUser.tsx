import { RECEIVE_USER_DETAILS } from 'actions/currentUser';
import { LOGOUT_SUCCESS } from 'actions/auth';
import { ItemsActionTypes, ItemsActions } from 'types/items';
import { InitialDataActionTypes, InitialDataActions } from 'actions/initialData';

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
    case ItemsActionTypes.RECEIVE_ITEMS:
      return action.userId ? { ...state, hasItems: true } : state;
    case RECEIVE_USER_DETAILS: {
      return {
        ...state,
        details: action.userDetails
      };
    }
    case InitialDataActionTypes.CLEAR_STATE:
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
