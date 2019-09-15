import { RouteComponentProps } from 'react-router-dom';
import { ICity, IItem } from 'global-utils/typings';

export interface IMatchParams {
  cityAlias: string;
  locale: string;
}

export interface ICityOwnProps extends RouteComponentProps<IMatchParams> {}

export interface ICityStateProps {
  cityItems: IItem[];
  selectedCity: ICity;
  shouldLoadCityItems: boolean;
  locale: string;
}

export interface ICityDispatchProps {
  loadCityItems: (cityAlias: string) => void;
}

export type ICityPageProps = ICityOwnProps & ICityStateProps & ICityDispatchProps;