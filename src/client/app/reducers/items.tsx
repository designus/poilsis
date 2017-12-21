import { SELECT_ITEM, RECEIVE_ITEMS, RECEIVE_ITEM, REMOVE_ITEM, RECEIVE_IMAGES } from '../actions';
import { IGenericState, removeDuplicates } from '../client-utils';
import { IImage } from 'global-utils';

export interface IItemsMap {
  alias: string;
  city: string;
  createdAt: string;
  id: string;
  name: string;
  types: string[];
  images?: IImage[];
}

export interface IItemsByCity {
  [key: string]: string[];
}

export type ItemsDataMap = IGenericState<IItemsMap>;

export interface IItemsState extends ItemsDataMap {
  selectedId?: string;
  allItemsLoaded?: boolean;
  itemsByCity?: IItemsByCity;
}

const initialItemsState = {
  dataMap: {},
  aliases: [],
  allItemsLoaded: false,
  itemsByCity: {},
};

export const removeItemFromCityState = (state: IItemsState, item: IItemsMap) => {
  return [...state.itemsByCity[item.city].filter(id => id !== item.id)];
};

export const getItemsByCityState = (state: IItemsState, newItem: IItemsMap) => {

  const oldItem = state.dataMap[newItem.id];
  const cityItems = [...(state.itemsByCity[newItem.city] || []), newItem.id].filter(removeDuplicates);

  if (oldItem && oldItem.city !== newItem.city) {
    return {
      ...state.itemsByCity,
      [oldItem.city]: removeItemFromCityState(state, oldItem),
      [newItem.city]: cityItems,
    };
  }

  return {...state.itemsByCity, [newItem.city]: cityItems};
};

export const items = (state: IItemsState = initialItemsState, action): IItemsState => {
  switch (action.type) {
    case SELECT_ITEM:
      return {...state, selectedId: action.itemId};
    case RECEIVE_ITEMS:
      return {
        ...state,
        dataMap: {...state.dataMap, ...action.dataMap},
        aliases: [...state.aliases, ...action.aliases],
        allItemsLoaded: action.allItemsLoaded,
        itemsByCity: {...state.itemsByCity, ...action.itemsByCity},
      };
    case RECEIVE_ITEM:
      return {
        ...state,
        itemsByCity: getItemsByCityState(state, action.item),
        dataMap: {
          ...state.dataMap,
          [action.item.id]: {
            ...(state.dataMap[action.item.id] || {}),
            ...action.item,
            fullInfo: true,
          },
        },
      };
    case REMOVE_ITEM:
      const {[action.item.id]: removedItem, ...dataMap} = state.dataMap;
      return {
        ...state,
        dataMap,
        itemsByCity: {
          ...state.itemsByCity,
          [removedItem.city]: removeItemFromCityState(state, removedItem),
        },
      };
    case RECEIVE_IMAGES:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.id]: {
            ...state.dataMap[action.id],
            images: action.images,
          },
        },
      };
    default:
      return state;
  }
};
