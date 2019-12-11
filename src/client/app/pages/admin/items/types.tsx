import { ActionCreatorsMapObject } from 'redux';
import { InjectedIntlProps } from 'react-intl';

import { IItemsMap, ICitiesMap, IUsersMap, ThunkReturn, ActionReturn } from 'types';
import { deleteItem, toggleItemEnabled, toggleItemRecommended, toggleItemApproved } from 'actions/items';
import { loadUserItems } from 'actions/currentUser';
import { endLoading } from 'actions/loader';
import { IItem, UserRoles } from 'global-utils/typings';

export interface IOwnProps extends InjectedIntlProps {}

export interface IDispatchProps extends ActionCreatorsMapObject {
  deleteItem: ThunkReturn<typeof deleteItem>;
  loadUserItems: ThunkReturn<typeof loadUserItems>;
  endLoading: ActionReturn<typeof endLoading>;
  toggleItemEnabled: ThunkReturn<typeof toggleItemEnabled>;
  toggleItemRecommended: ThunkReturn<typeof toggleItemRecommended>;
  toggleItemApproved: ThunkReturn<typeof toggleItemApproved>;
}

export interface IStateProps {
  itemsMap: IItemsMap;
  usersMap: IUsersMap;
  citiesMap: ICitiesMap;
  shouldLoadUserItems: boolean;
  userItems: IItem[];
  userRole: UserRoles;
  locale: string;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;

export type State = {
  isDeleteModalOpen: boolean;
  deleteId: string;
  search: string;
};
