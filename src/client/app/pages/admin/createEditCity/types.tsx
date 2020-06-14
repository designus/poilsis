import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { Locale } from 'global-utils/typings';
import { City } from 'global-utils/data-models';
import { ITypesMap, ThunkReturn } from 'types';
import { createCity, updateCity, getAdminCity } from 'actions/cities';

export interface IMatchParams {
  cityId: string;
}

export interface IOwnProps extends RouteComponentProps<IMatchParams>, InjectedIntlProps {}

export interface IDispatchProps {
  createCity: ThunkReturn<typeof createCity>;
  updateCity: ThunkReturn<typeof updateCity>;
  getCity: ThunkReturn<typeof getAdminCity>;
  initializeForm: (city: City) => void;
}

export interface IStateProps {
  loadedCity: City;
  showNavigationPrompt: boolean;
  typesMap: ITypesMap;
  shouldLoadEditCity: boolean;
  locale: Locale;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
