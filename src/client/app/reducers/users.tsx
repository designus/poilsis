import { RECEIVE_INITIAL_DATA } from '../actions';
import { IGenericState } from '../client-utils';

export interface IUser {
  id: string;
  name: string;
  role: string;
}

export interface IUsersState extends IGenericState<IUser> {}

export const users = (state: IUsersState = null, action): IUsersState => {
  switch (action.type) {
    case RECEIVE_INITIAL_DATA: {
      return {...state, ...action.data.users };
    }
    default:
      return state;
  }
};
