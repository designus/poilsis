import { Reducer } from 'redux';
import { IUsersState, InitialDataActions, InitialDataActionTypes } from 'types';

type ActionTypes = InitialDataActions;

const getInitialState = (): IUsersState => ({
  dataMap: {},
  aliases: {}
});

export const users: Reducer<IUsersState, ActionTypes> = (state = getInitialState(), action): IUsersState => {
  switch (action.type) {
    case InitialDataActionTypes.RECEIVE_INITIAL_DATA: {
      return {
        ...state,
        ...action.users
      };
    }
    default:
      return state;
  }
};
