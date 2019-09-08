export interface ICurrentUser {
  name?: string;
  role?: string;
  id?: string;
}

export interface ICurrentUserState {
  details: ICurrentUser;
  hasItems?: boolean;
}

export enum CurrentUserActionTypes {
  RECEIVE_USER_DETAILS = 'RECEIVE_USER_DETAILS'
}

export interface IReceiveUserDetails {
  type: CurrentUserActionTypes.RECEIVE_USER_DETAILS;
  userDetails: ICurrentUser;
}

export type CurrentUserActions = IReceiveUserDetails;
