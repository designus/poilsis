import { IUsersMap, IAppState } from 'types';

export const getUsersMap = (state: IAppState): IUsersMap => state.users.dataMap;
