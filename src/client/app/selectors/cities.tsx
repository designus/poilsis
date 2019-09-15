import { createSelector } from 'reselect';
import { ICity, IItem } from 'global-utils/typings';
import { getItemsMap, getLocale } from 'selectors';
import { getLocalizedText } from 'client-utils/methods';
import { IAppState, IItemLocalized, IItemsMap, ICityLocalized, ICitiesMap } from 'types';

export const getCitiesMap = (state: IAppState): ICitiesMap => state.cities.dataMap;

export const getCities = createSelector(
  [getCitiesMap, getLocale],
  (citiesMap: ICitiesMap, locale: string) =>
    Object.values(citiesMap).map((city: ICity): ICityLocalized => {
      return {
        ...city,
        description: getLocalizedText(city.description, locale),
        name: getLocalizedText(city.name, locale)
      };
    })
);

export const getCityById = (state: IAppState, cityId: string): ICity =>
  getCitiesMap(state)[cityId];

export const getCityByAlias = (state: IAppState, alias: string) =>
  getCities(state).find(city => city.alias === alias);

export const shouldLoadEditCity = (state: IAppState, cityId: string) => {
  return cityId && !state.loader.content && !getCityById(state, cityId);
};

export const getSelectedCityId = (state: IAppState, routeState = null) =>
  routeState ? routeState.cityId : state.cities.selectedId;

export const getSelectedCity = (state: IAppState, routeState): ICity => {
  return getCitiesMap(state)[getSelectedCityId(state, routeState)];
};

export const shouldLoadCityItems = (state: IAppState, routeState) => {
  const selectedCity = getSelectedCity(state, routeState);
  if (selectedCity) {
    return !selectedCity.hasItems;
  }
};

// TODO: Add types to selector
export const getCityItems = createSelector(
  [getSelectedCity, getItemsMap, getLocale],
  (selectedCity: ICity, itemsMap: IItemsMap, locale: string): IItem[] => {
    if (selectedCity) {
      return Object.values(itemsMap).filter((item: IItem) => item.cityId === selectedCity.id);
    }
    return [];
  }
);
