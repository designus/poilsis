import { createSelector } from 'reselect';
import { IAppState, ICity, IItemsMap, IItem } from 'reducers';
import { hasInitialDataLoaded, getItemsMap } from 'selectors';

export const shouldLoadEditCity = (state: IAppState, cityId: string) => {
  return cityId && !state.loader.content && !state.admin.cities[cityId] && hasInitialDataLoaded(state);
};

export const getCitiesMap = (state: IAppState) => state.cities.dataMap;

export const getSelectedCityId = (state: IAppState, routeState = null) =>
  routeState ? routeState.cityId : state.cities.selectedId;

export const getSelectedCity = (state: IAppState, routeState) => {
  return getCitiesMap(state)[getSelectedCityId(state, routeState)];
};

export const shouldLoadCityItems = (state: IAppState, routeState) => {
  const selectedCity = getSelectedCity(state, routeState);
  if (selectedCity) {
    return !selectedCity.hasItems && !state.items.hasAllItems && hasInitialDataLoaded(state);
  }
};

export const getCityItems = createSelector(
  [getSelectedCity, getItemsMap],
  (selectedCity: ICity, itemsMap: IItemsMap): IItem[] => {
    return selectedCity ?
      Object.values(itemsMap).filter((item: IItem) => item.cityId === selectedCity.id) :
      [];
  }
);

export const getCities = (state: IAppState): ICity[] => Object.values(getCitiesMap(state));
