import { createSelector } from 'reselect';
import { IAppState, ICurrentUser, IItemsMap, IItem } from 'reducers';
import { getItemsMap } from 'selectors';

export const getCurrentUser = (state: IAppState) => state.currentUser.details;

export const getUserItems = createSelector(
  [getCurrentUser, getItemsMap],
  (currentUser: ICurrentUser, itemsMap: IItemsMap): IItem[] =>
    Object.values(itemsMap).filter((item: IItem) => currentUser.id === item.userId),
);
