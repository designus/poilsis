import { InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { ICity, Languages } from 'global-utils/typings';
import { ITypesMap } from 'types';

interface IMatchParams {
  cityId: string;
}

export interface IOwnProps extends RouteComponentProps<IMatchParams>, InjectedIntlProps {}

export interface IDispatchProps {
  createCity: (city: ICity) => Promise<any>;
  updateCity: (city: ICity) => Promise<any>;
  getCity: (cityId: string) => Promise<any>;
  initializeForm: (city: ICity) => void;
}

export interface IStateProps {
  loadedCity: ICity;
  showNavigationPrompt: boolean;
  typesMap: ITypesMap;
  shouldLoadEditCity: boolean;
  locale: Languages;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
