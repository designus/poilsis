import { RouteComponentProps } from 'react-router-dom';
import { IItem, Languages } from 'global-utils/typings';
import { ThunkReturn } from 'types';
import { getClientItem } from 'actions/items';

export type MatchParams = {
  locale: Languages;
  cityAlias: string;
  itemAlias: string;
};

export type OwnProps = RouteComponentProps<MatchParams> & {};

export type StateProps = {
  selectedItem: IItem;
};

export type DispatchProps = {
  getClientItem: ThunkReturn<typeof getClientItem>;
};

export type ItemPageProps = OwnProps & StateProps & DispatchProps;
