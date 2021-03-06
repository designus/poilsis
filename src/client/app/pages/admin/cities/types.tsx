import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';

import { CitiesMap, ITypesMap, ThunkReturn } from 'types';
import { ICity, Locale } from 'global-utils/typings';
import { deleteCity, toggleCityEnabled } from 'actions/cities';

export interface IOwnProps extends InjectedIntlProps {}

export interface IDispatchProps {
  deleteCity: ThunkReturn<typeof deleteCity>;
  toggleCityEnabled: ThunkReturn<typeof toggleCityEnabled>;
}

export interface IStateProps  {
  citiesMap: CitiesMap;
  typesMap: ITypesMap;
  cities: ICity[];
  locale: Locale;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;

export type State = {
  isDeleteModalOpen: boolean;
  deleteId: string;
};
