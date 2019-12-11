import { IUser } from 'global-utils/typings';

export type UserDetails = Partial<Pick<IUser, 'name' | 'role' | 'id'>>;

export interface ICurrentUserState {
  details: UserDetails;
  hasItems?: boolean;
}

export enum CurrentUserActionTypes {
  RECEIVE_USER_DETAILS = 'RECEIVE_USER_DETAILS'
}

export interface IReceiveUserDetails {
  type: CurrentUserActionTypes.RECEIVE_USER_DETAILS;
  userDetails: UserDetails;
}

export type CurrentUserActions = IReceiveUserDetails;
