import { Reducer } from 'redux';
import {
  AuthActionTypes,
  AuthActions,
  ItemsActionTypes,
  CurrentUserActions,
  CurrentUserActionTypes,
  ItemsActions,
  ICurrentUserState,
  InitialDataActionTypes,
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
    case ItemsActionTypes.RECEIVE_ITEMS:
      return action.userId ? { ...state, hasItems: true } : state;
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
