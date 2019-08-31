import { Reducer } from 'redux';
import { InitialDataActionTypes, InitialDataActions } from 'actions/initialData';
import {
  AuthActionTypes,
  AuthActions,
  ItemsActionTypes,
  CurrentUserActions,
  CurrentUserActionTypes,
  ItemsActions,
  ICurrentUserState
} from 'types';

const getInitialState = (): ICurrentUserState => ({
  details: {},
  hasItems: false
});

type ActionTypes = CurrentUserActions | ItemsActions | InitialDataActions | AuthActions;

export const currentUser: Reducer<ICurrentUserState, ActionTypes> =
(state: ICurrentUserState = getInitialState(), action): ICurrentUserState => {
  switch (action.type) {
    case ItemsActionTypes.RECEIVE_ITEMS:
      return action.userId ? { ...state, hasItems: true } : state;
    case CurrentUserActionTypes.RECEIVE_USER_DETAILS: {
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
    case AuthActionTypes.LOGOUT_SUCCESS: {
      return getInitialState();
    }
    default:
      return state;
  }
};
