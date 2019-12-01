import { InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { IItem, Languages } from 'global-utils/typings';
import { ThunkReturn } from 'types';
import { getItem } from 'actions/items';

export type ItemPageMatchParams = {
  itemId: string;
  userId: string;
};

export interface IOwnProps extends RouteComponentProps<ItemPageMatchParams>, InjectedIntlProps {}

export interface IStateProps {
  loadedItem: IItem;
  shouldLoadEditItem: boolean;
  locale: Languages;
}

export interface IDispatchProps {
  loadAdminItem: ThunkReturn<typeof getItem>;
}

export type CreateEditItemProps = IOwnProps & IStateProps & IDispatchProps;
