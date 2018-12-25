import { createSelector } from 'reselect';
import { IAppState, ICity, ICitiesMap, IItemsMap, IItem } from 'reducers';
import { hasInitialDataLoaded, getItemsMap } from 'selectors';

export const shouldLoadCity = (state: IAppState, cityId: string) => {
  return cityId && !state.loader.content && !state.admin.cities[cityId] && hasInitialDataLoaded(state);
};

export const getSelectedCity = (state: IAppState) => state.cities.dataMap[state.cities.selectedId];

export const getCitiesMap = (state: IAppState) => state.cities.dataMap;

export const getCityItems = createSelector(
  [getSelectedCity, getItemsMap],
  (selectedCity: ICity, itemsMap: IItemsMap): IItem[] =>
    Object.values(itemsMap).filter((item: IItem) => item.cityId === selectedCity.id),
);

export const getCities = createSelector(
  [getCitiesMap],
  (citiesMap: ICitiesMap) => Object.values(citiesMap),
);
