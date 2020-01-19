import { createSelector } from 'reselect';
import { ICity, IItem } from 'global-utils/typings';
import { getItemsMap, getClientLocale, isLoggedIn } from 'selectors';
import { IAppState, IItemsMap, ICitiesMap } from 'types';

export const getCitiesMap = (state: IAppState): ICitiesMap => state.cities.dataMap;

export const getAllCities = (state: IAppState) => Object.values(getCitiesMap(state));

export const getEnabledCities = (state: IAppState) => {
  const allCities = getAllCities(state);
  const locale = getClientLocale(state);
  const loggedIn = isLoggedIn(state);
  return allCities.filter(city => {
    if (!city.isEnabled) return false;
    return loggedIn ? city.isEnabled[locale] : city.isEnabled;
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

export const shouldLoadEditCity = (state: IAppState, cityId?: string): boolean => {
  const city = getCityById(state, cityId);
  return cityId && !state.loader.content && (!city || !city.isFullyLoaded);
};

export const shouldLoadCityItems = (state: IAppState, alias: string) => {
  const selectedCity = getCityByAlias(state, alias);
  if (selectedCity) {
    return !selectedCity.hasItems;
  }

  return false;
};

export const getCityItems = createSelector<IAppState, string, ICity, IItemsMap, IItem[]>(
  [getCityByAlias, getItemsMap],
  (selectedCity, itemsMap) => {
    if (selectedCity) {
      return Object.values(itemsMap).filter(item => item.cityId === selectedCity.id);
    }
    return [];
  }
);
