import { RouteComponentProps } from 'react-router-dom';
import { IItem, Locale } from 'global-utils/typings';
import { ThunkReturn, ICitiesMap } from 'types';
import { getClientItem } from 'actions/items';

export type MatchParams = {
  locale: Locale;
  cityAlias: string;
  itemAlias: string;
};

export type OwnProps = RouteComponentProps<MatchParams> & {};

export type StateProps = {
  selectedItem: IItem | null;
  citiesMap: ICitiesMap;
};

export type DispatchProps = {
  getClientItem: ThunkReturn<typeof getClientItem>;
};

export type ItemPageProps = OwnProps & StateProps & DispatchProps;
