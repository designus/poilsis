import { Reducer } from 'redux';
import { removeItemById } from 'client-utils/methods';
import { ItemsActionTypes, ItemsActions, IItemsState, InitialDataActionTypes, InitialDataActions } from 'types';

type ActionTypes = ItemsActions | InitialDataActions;

const getInitialState = (): IItemsState => ({
  dataMap: {},
  aliases: []
});

export const items: Reducer<IItemsState, ActionTypes> = (state = getInitialState(), action): IItemsState => {
  switch (action.type) {
    case InitialDataActionTypes.CLEAR_STATE:
      return getInitialState();
    case ItemsActionTypes.SELECT_ITEM:
      return {
        ...state,
        selectedId: action.itemId
      };
    case ItemsActionTypes.RECEIVE_ITEMS:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          ...action.dataMap
        },
        aliases: [
          ...state.aliases,
          ...action.aliases
        ]
      };
    case ItemsActionTypes.CLEAR_SELECTED_ITEM:
      return {
        ...state,
        selectedId: null
      };
    case ItemsActionTypes.RECEIVE_ITEM:
      return {
        ...state,
        selectedId: action.item.id,
        dataMap: {
          ...state.dataMap,
          [action.item.id]: {
            ...(state.dataMap[action.item.id] || {}),
            ...action.item,
            isFullyLoaded: true
          }
        }
      };
    case ItemsActionTypes.RECEIVE_ITEM_DESCRIPTION:
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
    case ItemsActionTypes.TOGGLE_ITEM_ENABLED:
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
    case ItemsActionTypes.TOGGLE_ITEM_RECOMMENDED:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.itemId]: {
            ...state.dataMap[action.itemId],
            isRecommended: action.isRecommended
          }
        }
      };
    case ItemsActionTypes.REMOVE_ITEM:
      return {
        ...state,
        dataMap: removeItemById(action.itemId, state.dataMap)
      };
    case ItemsActionTypes.RECEIVE_IMAGES:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.itemId]: {
            ...state.dataMap[action.itemId],
            images: action.images
          }
        }
      };
    default:
      return state;
  }
};
