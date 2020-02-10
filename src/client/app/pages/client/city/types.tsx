import { RouteComponentProps } from 'react-router-dom';
import { ICity, IItem, Locale } from 'global-utils/typings';

export interface IMatchParams {
  cityAlias: string;
  locale: Locale;
}

export interface IOwnProps extends RouteComponentProps<IMatchParams> {}

export interface IStateProps {
  cityItems: IItem[];
  selectedCity: ICity;
  shouldLoadCityItems: boolean;
  locale: Locale;
}

export interface IDispatchProps {
  loadCityItems: (cityAlias: string) => void;
}

export type ICityPageProps = IOwnProps & IStateProps & IDispatchProps;
