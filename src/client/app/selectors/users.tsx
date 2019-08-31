import { IUsersMap, IAppState } from 'types';

export const getCurrentUserId = (state: IAppState) => state.currentUser.details.id;

export const getUsersMap = (state: IAppState): IUsersMap => state.users.dataMap;
