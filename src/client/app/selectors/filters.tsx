import { IAppState } from 'types';
import { getCityByAlias } from './cities';

export const getCityFilters = (state: IAppState, alias: string) => state.filters.cities[getCityByAlias(state, alias).id];

export const getTypeFilterValue = (state: IAppState, alias: string) => getCityFilters(state, alias).type;

export const getPriceFilterValue = (state: IAppState, alias: string) => getCityFilters(state, alias).price;
