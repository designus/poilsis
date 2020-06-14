import { Reducer } from 'redux';
import { removeByKeys, getAliasState, getAliasKeysById } from 'client-utils/methods';
import { ItemsActionTypes, ItemsActions, IItemsState, InitialDataActions } from 'types';
import { IsEnabled } from 'global-utils/data-models';

type ActionTypes = ItemsActions | InitialDataActions;

export const getInitialItemsState = (): IItemsState => ({
  dataMap: {},
  aliases: {}
});

export const items: Reducer<IItemsState, ActionTypes> = (state = getInitialItemsState(), action): IItemsState => {
  switch (action.type) {
    case ItemsActionTypes.RECEIVE_ITEMS:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          ...action.dataMap
        },
        aliases: {
          ...state.aliases,
          ...action.aliases
        }
      };
    case ItemsActionTypes.RECEIVE_ITEM:
      return {
        ...state,
        aliases: {
          ...state.aliases,
          ...getAliasState(action.item.alias, action.item.id)
        },
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
      return typeof state.dataMap[action.itemId].isEnabled !== 'boolean' ? {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.itemId]: {
            ...state.dataMap[action.itemId],
            isEnabled: {
              ...state.dataMap[action.itemId].isEnabled as IsEnabled,
              [action.locale]: action.isEnabled
            }
          }
        }
      } : state;
    case ItemsActionTypes.REMOVE_MOCKED_DATA:
      return getInitialItemsState();
    case ItemsActionTypes.RECEIVE_MOCKED_DATA:
      return {
        ...state,
        dataMap: action.dataMap,
        aliases: action.aliases
      };
    case ItemsActionTypes.TOGGLE_ITEM_APPROVED_BY_ADMIN:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.itemId]: {
            ...state.dataMap[action.itemId],
            isApprovedByAdmin: action.isApproved
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
        dataMap: removeByKeys([action.itemId], state.dataMap),
        aliases: removeByKeys(getAliasKeysById(state, action.itemId), state.aliases)
      };
    case ItemsActionTypes.RECEIVE_IMAGES:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.itemId]: {
            ...state.dataMap[action.itemId],
            mainImage: action.mainImage ? action.mainImage : state.dataMap[action.itemId].mainImage,
            images: action.images
          }
        }
      };
    default:
      return state;
  }
};
