import { IGenericDataMap, IGenericState } from './generic';

export interface IUser {
  id: string;
  name: string;
  role: string;
}

export type IUsersMap = IGenericDataMap<IUser>;
export interface IUsersState extends IGenericState<IUser> {}