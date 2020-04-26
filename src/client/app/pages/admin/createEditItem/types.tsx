import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { Locale } from 'global-utils/typings';
import { Item } from 'data-models';
import { ThunkReturn } from 'types';
import { getAdminItem } from 'actions/items';

export type ItemPageMatchParams = {
  itemId: string;
  userId: string;
};

export interface IOwnProps extends RouteComponentProps<ItemPageMatchParams>, InjectedIntlProps {}

export interface IStateProps {
  loadedItem: Item;
  shouldLoadEditItem: boolean;
  locale: Locale;
}

export interface IDispatchProps {
  loadAdminItem: ThunkReturn<typeof getAdminItem>;
}

export type CreateEditItemProps = IOwnProps & IStateProps & IDispatchProps;
