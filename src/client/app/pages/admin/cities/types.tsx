import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';

import { ICitiesMap, ITypesMap, ThunkReturn } from 'types';
import { ICity } from 'global-utils/typings';
import { deleteCity, toggleCityEnabled } from 'actions/cities';

export interface IOwnProps extends InjectedIntlProps {}

export interface IDispatchProps {
  deleteCity: ThunkReturn<typeof deleteCity>;
  toggleCityEnabled: ThunkReturn<typeof toggleCityEnabled>;
}

export interface IStateProps  {
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  cities: ICity[];
  locale: string;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;

export type State = {
  isDeleteModalOpen: boolean;
  deleteId: string;
};
