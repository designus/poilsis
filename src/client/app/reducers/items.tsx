import { SELECT_ITEM, RECEIVE_ITEMS, RECEIVE_ITEM, REMOVE_ITEM, RECEIVE_IMAGES, TOGGLE_ITEM_VISIBILITY } from 'actions';
import { IGenericState, IGenericDataMap } from 'client-utils';
import { IItemFields } from 'global-utils';

export interface IItem extends IItemFields {
  isFullyLoaded?: boolean;
}

export type IItemsMap = IGenericDataMap<IItem>;

export interface IItemsState extends IGenericState<IItem> {
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
    case TOGGLE_ITEM_VISIBILITY:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.itemId]: {
            ...state.dataMap[action.itemId],
            isEnabled: action.isEnabled,
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
