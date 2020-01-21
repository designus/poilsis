import { Reducer } from 'redux';
import {
  AuthActionTypes,
  AuthActions,
  CurrentUserActions,
  CurrentUserActionTypes,
  ItemsActions,
  ICurrentUserState,
  InitialDataActions
} from 'types';

const getInitialState = (): ICurrentUserState => ({
  details: {},
  hasItems: false
});

type ActionTypes = CurrentUserActions | ItemsActions | InitialDataActions | AuthActions;

export const currentUser: Reducer<ICurrentUserState, ActionTypes> =
(state: ICurrentUserState = getInitialState(), action): ICurrentUserState => {
  switch (action.type) {
    case CurrentUserActionTypes.SET_USER_ITEMS:
      return {
        ...state,
        hasItems: true
      };
    case CurrentUserActionTypes.RECEIVE_USER_DETAILS: {
      return {
        ...state,
        details: action.userDetails
      };
    }
    case AuthActionTypes.LOGOUT_SUCCESS: {
      return getInitialState();
    }
    default:
      return state;
  }
};
