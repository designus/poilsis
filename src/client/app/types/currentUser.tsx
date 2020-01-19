import { IUser } from 'global-utils/typings';

export type UserDetails = Partial<Pick<IUser, 'name' | 'role' | 'id'>>;

export interface ICurrentUserState {
  details: UserDetails;
  hasItems?: boolean;
}

export enum CurrentUserActionTypes {
  RECEIVE_USER_DETAILS = 'RECEIVE_USER_DETAILS',
  SET_USER_ITEMS = 'SET_USER_ITEMS'
}

export interface IReceiveUserDetails {
  type: CurrentUserActionTypes.RECEIVE_USER_DETAILS;
  userDetails: UserDetails;
}

export interface ISetUserItems {
  type: CurrentUserActionTypes.SET_USER_ITEMS;
}

export type CurrentUserActions = IReceiveUserDetails | ISetUserItems;
