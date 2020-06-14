import { createSelector } from 'reselect';
import { Price, City, Item } from 'global-utils/data-models';
import { isNumber } from 'global-utils/methods';
import { getItemsMap, getClientLocale } from 'selectors';
import { IAppState, IItemsMap, CitiesMap, ICityFilters } from 'types';
import { DEFAULT_CITY_FITLERS } from 'client-utils/constants';
import { getCityFilters } from './filters';

export const getCitiesMap = (state: IAppState): CitiesMap => state.cities.dataMap;

export const getAllCities = (state: IAppState): City[] => Object.values(getCitiesMap(state));

export const getEnabledCities = (state: IAppState): City[] => {
  const allCities = getAllCities(state);
  const locale = getClientLocale(state);
  return allCities.filter(city => {
    if (!city.isEnabled) return false;
    return typeof city.isEnabled === 'boolean' ? city.isEnabled : city.isEnabled[locale];
  });
};

export const getCitiesAliases = (state: IAppState) => state.cities.aliases;

export const getCityById = (state: IAppState, cityId: string): City =>
  getCitiesMap(state)[cityId];

export const getCityByAlias = (state: IAppState, alias: string): City => {
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

export const getSelectedCityId = (state: IAppState, alias: string) => getCityByAlias(state, alias).id;

const filterByPrice = (itemPrice: Price, priceFilter: Price) => {
  const filterFrom = priceFilter.from || 0;
  const filterTo = priceFilter.to || Number.MAX_SAFE_INTEGER;

  if (isNumber(itemPrice.from) && isNumber(itemPrice.to)) {
    return itemPrice.from >= filterFrom && itemPrice.to <= filterTo;
  } else if (isNumber(itemPrice.from) && !isNumber(itemPrice.to)) {
    return itemPrice.from >= filterFrom && itemPrice.from <= filterTo;
  } else if (!isNumber(itemPrice.from) && isNumber(itemPrice.to)) {
    return itemPrice.to >= filterFrom && itemPrice.to <= filterTo;
  }

  return true;
};

export const getCityItems = createSelector<IAppState, string, string, IItemsMap, ICityFilters | undefined,  Item[]>(
  [getSelectedCityId, getItemsMap, getCityFilters],
  (selectedCityId, itemsMap, cityFilters) => {
    if (selectedCityId && cityFilters) {
      const { type, price } = cityFilters;
      return Object.values(itemsMap).filter(item => {
        const filterByCity = item.cityId === selectedCityId;
        const filterByType = type !== DEFAULT_CITY_FITLERS.type ? item.types.includes(type) : true;
        return filterByCity && filterByType && filterByPrice(item.price, price);
      });
    }
    return [];
  }
);
