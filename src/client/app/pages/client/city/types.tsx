import { RouteComponentProps } from 'react-router-dom';
import { ICity, IItem, Locale } from 'global-utils/typings';

export interface IMatchParams {
  cityAlias: string;
  locale: Locale;
}

export type OwnProps = RouteComponentProps<IMatchParams>;

export type StateProps = {
  cityItems: IItem[];
  selectedCity: ICity;
  shouldLoadCityItems: boolean;
  locale: Locale;
};

export type Dispatch = {
  loadCityItems: (cityAlias: string) => void;
};

export type Props = OwnProps & StateProps & Dispatch;
