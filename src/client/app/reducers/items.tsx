import { IGenericState, IGenericDataMap } from 'client-utils/types';
import { removeItemById } from 'client-utils/methods';
import { IItemFields } from 'global-utils';
import {
  SELECT_ITEM,
  RECEIVE_ITEMS,
  RECEIVE_ITEM,
  REMOVE_ITEM,
  RECEIVE_IMAGES,
  TOGGLE_ITEM_VISIBILITY,
  CLEAR_SELECTED_ITEM,
  RECEIVE_ITEM_DESCRIPTION
} from 'actions/items';
import { CLEAR_STATE } from 'actions/initialData';

export interface IItem extends IItemFields {
  isFullyLoaded?: boolean;
  mainImage?: string;
}

export type IItemsMap = IGenericDataMap<IItem>;

export interface IItemsState extends IGenericState<IItem> {
  selectedId?: string;
  hasAllItems?: boolean;
}

const getInitialState = (): IItemsState => ({
  dataMap: {},
  aliases: [],
  hasAllItems: false
});

export const items = (state: IItemsState = getInitialState(), action): IItemsState => {
  switch (action.type) {
    case CLEAR_STATE:
      return getInitialState();
    case SELECT_ITEM:
      return {...state, selectedId: action.itemId};
    case RECEIVE_ITEMS:
      return {
        ...state,
        dataMap: {...state.dataMap, ...action.dataMap},
        aliases: [...state.aliases, ...action.aliases],
        hasAllItems: action.hasAllItems
      };
    case CLEAR_SELECTED_ITEM:
      return {
        ...state,
        selectedId: null
      };
    case RECEIVE_ITEM:
      return {
        ...state,
        selectedId: action.itemId,
        dataMap: {
          ...state.dataMap,
          [action.itemId]: {
            ...(state.dataMap[action.itemId] || {}),
            ...action.item,
            isFullyLoaded: true
          }
        }
      };
    case RECEIVE_ITEM_DESCRIPTION:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.itemId]: {
            ...state.dataMap[action.itemId],
            ...action.descFields
          }
        }
      };
    case TOGGLE_ITEM_VISIBILITY:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.itemId]: {
            ...state.dataMap[action.itemId],
            isEnabled: action.isEnabled
          }
        }
      };
    case REMOVE_ITEM:
      return {
        ...state,
        dataMap: removeItemById(action.item.id, state.dataMap)
      };
    case RECEIVE_IMAGES:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.id]: {
            ...state.dataMap[action.id],
            images: action.images
          }
        }
      };
    default:
      return state;
  }
};
