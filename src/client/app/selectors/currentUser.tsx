import { createSelector } from 'reselect';
import { IItemsMap, UserDetails, IAppState } from 'types';
import { IItem, UserRoles } from 'global-utils/typings';
import { getItemsMap } from 'selectors';

export const getCurrentUser = (state: IAppState) => state.currentUser.details;

export const getCurrentUserRole = (state: IAppState): UserRoles => getCurrentUser(state).role;

export const getUserItems = createSelector(
  [getCurrentUser, getItemsMap],
  (currentUser: UserDetails, itemsMap: IItemsMap): IItem[] =>
    Object.values(itemsMap).filter((item: IItem) => currentUser.id === item.userId)
);
