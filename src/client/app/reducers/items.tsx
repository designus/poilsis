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
  isFullyLoaded?: boolean;
}

export interface ICityItems {
  list: string[];
  isAllLoaded: boolean;
}

export interface IItemsGroupedByCity {
  [key: string]: ICityItems;
}

export type ItemsDataMap = IGenericState<IItemsMap>;

export interface IItemsState extends ItemsDataMap {
  selectedId?: string;
  isAllLoaded?: boolean;
  itemsByCity?: IItemsGroupedByCity;
  userItems?: string[];
}

const initialItemsState = {
  dataMap: {},
  aliases: [],
  isAllLoaded: false,
  itemsByCity: {},
  userItems: [],
};

export const changeItemCity = (removeItem: boolean) => (state: IItemsState, item: IItemsMap): ICityItems => {
  const oldList = state.itemsByCity[item.city].list;
  const { isAllLoaded } = state.itemsByCity[item.city];
  const list = removeItem ? [...oldList.filter(id => id !== item.id)] : [...(oldList || []), item.id].filter(removeDuplicates);

  return { list, isAllLoaded };
};

export const removeItemFromCityState = changeItemCity(true);
export const addItemToCityState = changeItemCity(false);

export const getItemsByCityState = (state: IItemsState, newItem: IItemsMap) => {

  const oldItem = state.dataMap[newItem.id];
  const cityWasChanged = oldItem.city !== newItem.city;

  if (oldItem && cityWasChanged) {
    return {
      ...state.itemsByCity,
      [oldItem.city]: removeItemFromCityState(state, oldItem),
      [newItem.city]: addItemToCityState(state, newItem),
    };
  }

  return {...state.itemsByCity, [newItem.city]: addItemToCityState(state, newItem)};
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
        isAllLoaded: action.isAllLoaded,
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
            isFullyLoaded: true,
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
