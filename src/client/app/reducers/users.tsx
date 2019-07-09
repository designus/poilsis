import { RECEIVE_INITIAL_DATA } from 'actions/initialData';
import { IGenericState, IGenericDataMap } from 'client-utils/types';

export interface IUser {
  id: string;
  name: string;
  role: string;
}

export type IUsersMap = IGenericDataMap<IUser>;
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
