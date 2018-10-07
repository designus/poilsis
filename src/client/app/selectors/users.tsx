import { IAppState } from 'reducers';

export const getCurrentUserId = (state: IAppState) => state.currentUser.details.id;
