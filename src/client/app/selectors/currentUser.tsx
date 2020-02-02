import { createSelector } from 'reselect';
import { IAppState } from 'types';
import { IItem } from 'global-utils/typings';
import { getItemsMap } from 'selectors';

export const getCurrentUser = (state: IAppState) => state.currentUser.details;

export const getCurrentUserRole = (state: IAppState) => getCurrentUser(state)?.role;

export const getCurrentUserId = (state: IAppState) => getCurrentUser(state)?.id;

export const getUserItems = createSelector(
  [getCurrentUser, getItemsMap],
  (currentUser, itemsMap): IItem[] =>
    Object.values(itemsMap).filter((item: IItem) => {
      return currentUser && currentUser.id === item.userId;
    })
);
