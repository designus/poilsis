import { createSelector } from 'reselect';
import { ICity, IItem, ICityFilters } from 'global-utils/typings';
import { getItemsMap, getClientLocale } from 'selectors';
import { IAppState, IItemsMap, CitiesMap } from 'types';

export const getCitiesMap = (state: IAppState): CitiesMap => state.cities.dataMap;

export const getAllCities = (state: IAppState): ICity[] => Object.values(getCitiesMap(state));

export const getEnabledCities = (state: IAppState): ICity[] => {
  const allCities = getAllCities(state);
  const locale = getClientLocale(state);
  return allCities.filter(city => {
    if (!city.isEnabled) return false;
    return typeof city.isEnabled === 'boolean' ? city.isEnabled : city.isEnabled[locale];
  });
};

export const getCitiesAliases = (state: IAppState) => state.cities.aliases;

export const getCityById = (state: IAppState, cityId: string): ICity =>
  getCitiesMap(state)[cityId];

export const getCityByAlias = (state: IAppState, alias: string): ICity => {
  const aliases = getCitiesAliases(state);
  const cityId = aliases[alias];
  return getCitiesMap(state)[cityId];
};

export const shouldLoadEditCity = (state: IAppState, cityId: string): boolean => {
  const city = getCityById(state, cityId);
  return Boolean(cityId && !state.loader.content && (!city || !city.isFullyLoaded));
};

export const shouldLoadCityItems = (state: IAppState, alias: string) => {
  const selectedCity = getCityByAlias(state, alias);
  if (selectedCity) {
    return !selectedCity.hasItems;
  }

  return false;
};

export const getCityFilters = (state: IAppState, alias: string) => getCityByAlias(state, alias)?.filters;

export const getSelectedCityId = (state: IAppState, alias: string) => getCityByAlias(state, alias).id;

export const getCityItems = createSelector<IAppState, string, string, IItemsMap, ICityFilters | undefined,  IItem[]>(
  [getSelectedCityId, getItemsMap, getCityFilters],
  (selectedCityId, itemsMap, cityFilters) => {
    if (selectedCityId && cityFilters) {
      return Object.values(itemsMap).filter(item => {
        const { type } = cityFilters;
        const filterByCity = item.cityId === selectedCityId;
        const filterByType = type !== 'all' ? item.types.includes(type) : true;
        return filterByCity && filterByType;
      });
    }
    return [];
  }
);
