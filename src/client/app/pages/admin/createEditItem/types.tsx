import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { IItem, Locale } from 'global-utils/typings';
import { ThunkReturn } from 'types';
import { getAdminItem } from 'actions/items';

export type ItemPageMatchParams = {
  itemId: string;
  userId: string;
};

export interface IOwnProps extends RouteComponentProps<ItemPageMatchParams>, InjectedIntlProps {}

export interface IStateProps {
  loadedItem: IItem;
  shouldLoadEditItem: boolean;
  locale: Locale;
}

export interface IDispatchProps {
  loadAdminItem: ThunkReturn<typeof getAdminItem>;
}

export type CreateEditItemProps = IOwnProps & IStateProps & IDispatchProps;
