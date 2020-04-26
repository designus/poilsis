import { RouteComponentProps } from 'react-router-dom';
import { Locale } from 'global-utils/typings';
import { City, Item } from 'data-models';

export type MatchParams = {
  cityAlias: string;
  locale: Locale;
};

export type OwnProps = RouteComponentProps<MatchParams>;

export type StateProps = {
  cityItems: Item[];
  selectedCity: City;
  shouldLoadCityItems: boolean;
  locale: Locale;
};

export type Dispatch = {
  loadCityItems: (cityAlias: string) => void;
};

export type Props = OwnProps & StateProps & Dispatch;
