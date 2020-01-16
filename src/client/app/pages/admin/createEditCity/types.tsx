import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { ICity, Languages } from 'global-utils/typings';
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
