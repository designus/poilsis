import { createSelector } from 'reselect';
import { IAppState } from 'types';
import { Item } from 'data-models';
import { getItemsMap } from 'selectors';

export const getCurrentUser = (state: IAppState) => state.currentUser.details;

export const getCurrentUserRole = (state: IAppState) => getCurrentUser(state)?.role;

export const getCurrentUserId = (state: IAppState) => getCurrentUser(state)?.id;

export const getUserItems = createSelector(
  [getCurrentUser, getItemsMap],
  (currentUser, itemsMap): Item[] =>
    Object.values(itemsMap).filter((item: Item) => {
      return currentUser && currentUser.id === item.userId;
    })
);
