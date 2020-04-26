import { RouteComponentProps } from 'react-router-dom';
import { Locale } from 'global-utils/typings';
import { Item } from 'data-models';
import { ThunkReturn, CitiesMap } from 'types';
import { getClientItem } from 'actions/items';

export type MatchParams = {
  locale: Locale;
  cityAlias: string;
  itemAlias: string;
};

export type OwnProps = RouteComponentProps<MatchParams> & {};

export type StateProps = {
  selectedItem: Item | null;
  citiesMap: CitiesMap;
};

export type DispatchProps = {
  getClientItem: ThunkReturn<typeof getClientItem>;
};

export type ItemPageProps = OwnProps & StateProps & DispatchProps;
