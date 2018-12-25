import { createSelector } from 'reselect';
import { IAppState, ICity, IItemsMap, IItem } from 'reducers';
import { hasInitialDataLoaded, getItems } from 'selectors';

export const shouldLoadCity = (state: IAppState, cityId: string) => {
  return !state.loader.content && !state.admin.cities[cityId] && hasInitialDataLoaded(state);
};

export const getSelectedCity = (state: IAppState) => state.cities.dataMap[state.cities.selectedId];

export const getCityItems = createSelector(
  [getSelectedCity, getItems],
  (selectedCity: ICity, items: IItemsMap): IItem[] =>
    Object.values(items).filter((item: IItem) => item.cityId === selectedCity.id),
);
