import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';

import { IItemsMap, CitiesMap, IUsersMap, ThunkReturn, ActionReturn } from 'types';
import { deleteItem, toggleItemEnabled, toggleItemRecommended, toggleItemApproved } from 'actions/items';
import { loadUserItems } from 'actions/currentUser';
import { endLoading } from 'actions/loader';
import { UserRoles, Locale } from 'global-utils/typings';
import { Item } from 'data-models';

export interface IOwnProps extends InjectedIntlProps {}

export interface IDispatchProps {
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
  citiesMap: CitiesMap;
  shouldLoadUserItems: boolean;
  userItems: Item[];
  userRole?: UserRoles;
  locale: Locale;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;

export type State = {
  isDeleteModalOpen: boolean;
  deleteId: string;
  search: string;
};
