import { IAppState } from 'types';
import { getCityByAlias } from './cities';

export const getCityFilters = (state: IAppState, alias: string) => state.filters.cities[getCityByAlias(state, alias).id];
