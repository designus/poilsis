import { SELECT_CITY, RECEIVE_INITIAL_DATA, RECEIVE_CITY_ITEMS, REMOVE_CITY_ITEM, ADD_CITY_ITEM } from '../actions';
import { IGenericState, removeDuplicates, IGenericDataMap } from '../client-utils';

export interface ICityItems {
  items: string[];
  haveAllItemsLoaded: boolean;
}

export interface ICitiesItems {
  [key: string]: ICityItems;
}

export interface ICity {
  id: string;
  alias: string;
  description: string;
  name: string;
  types: string[];
  items: string[];
  haveAllItemsLoaded: boolean;
}

export type ICitiesMap = IGenericDataMap<ICity>;

export interface ICityState extends IGenericState<ICity> {
  selectedId?: string;
}

export const changeCityItem = (removeItem: boolean) => (cityItems: string[], itemId): string[] => {
  if (removeItem) {
    return [...cityItems.filter(id => id !== itemId)];
  } else {
    return [...cityItems, itemId].filter(removeDuplicates);
  }
};

export const mergeCityItems = (citiesMap: ICitiesMap, cityItems: ICitiesItems) => {
  return Object.keys(citiesMap).reduce((acc: ICitiesMap, cityId: string) => {
    acc[cityId] = {...citiesMap[cityId], ...cityItems[cityId]};
    return acc;
  }, {});
};

export const removeCityItem = changeCityItem(true);
export const addCityItem = changeCityItem(false);

export const cities = (state: ICityState = null, action): ICityState => {
  switch (action.type) {
    case SELECT_CITY:
      return {...state, selectedId: action.cityId};
    case RECEIVE_INITIAL_DATA:
      return {...state, ...action.data.cities};
    case RECEIVE_CITY_ITEMS:
      return {
        ...state,
        dataMap: mergeCityItems(state.dataMap, action.items),
      };
    case REMOVE_CITY_ITEM:
      return {
        ...state,
        dataMap: {
          [action.cityId]: {
            ...state.dataMap[action.cityId],
            items: removeCityItem(state.dataMap[action.cityId].items, action.itemId),
          },
        },
      };
    case ADD_CITY_ITEM:
      return {
        ...state,
        dataMap: {
          [action.cityId]: {
            ...state.dataMap[action.cityId],
            items: addCityItem(state.dataMap[action.cityId].items, action.itemId),
          },
        },
      };
    default:
      return state;
  }
};
