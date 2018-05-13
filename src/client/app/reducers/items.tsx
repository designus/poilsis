import { SELECT_ITEM, RECEIVE_ITEMS, RECEIVE_ITEM, REMOVE_ITEM, RECEIVE_IMAGES } from '../actions';
import { IGenericState } from '../client-utils';
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

export type ItemsDataMap = IGenericState<IItemsMap>;

export interface IItemsState extends ItemsDataMap {
  selectedId?: string;
  isAllLoaded?: boolean;
}

const initialItemsState = {
  dataMap: {},
  aliases: [],
  isAllLoaded: false,
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
      };
    case RECEIVE_ITEM:
      return {
        ...state,
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
