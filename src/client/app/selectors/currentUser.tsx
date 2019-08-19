import { createSelector } from 'reselect';
import { IAppState, ICurrentUser, IItemsMap } from 'reducers';
import { IItem } from 'global-utils/typings';
import { getItemsMap } from 'selectors';

export const getCurrentUser = (state: IAppState) => state.currentUser.details;

export const getCurrentUserRole = (state: IAppState) => getCurrentUser(state).role;

export const getUserItems = createSelector(
  [getCurrentUser, getItemsMap],
  (currentUser: ICurrentUser, itemsMap: IItemsMap): IItem[] =>
    Object.values(itemsMap).filter((item: IItem) => currentUser.id === item.userId)
);
