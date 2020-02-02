import { IUsersState, InitialDataActionTypes } from 'types';

export const users = (state: IUsersState = null, action: any): IUsersState => {
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
