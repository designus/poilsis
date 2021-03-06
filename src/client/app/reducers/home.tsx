import { Reducer } from 'redux';
import { toggleItemInArray } from 'client-utils/methods';
import {
  HomeActionTypes,
  HomeActions,
  IHomeState,
  ItemsActions,
  ItemsActionTypes,
  InitialDataActions
} from 'types';

type ActionTypes = HomeActions | ItemsActions | InitialDataActions;

export const getInitialHomeState = (): IHomeState => ({
  isLoaded: false,
  recommendedItems: []
});

export const home: Reducer<IHomeState, ActionTypes> = (state = getInitialHomeState(), action): IHomeState => {
  switch (action.type) {
    case HomeActionTypes.RECEIVE_RECOMMENDED_ITEMS:
      return {
        ...state,
        isLoaded: true,
        recommendedItems: action.items
      };
    case ItemsActionTypes.TOGGLE_ITEM_RECOMMENDED:
      return {
        ...state,
        recommendedItems: toggleItemInArray(state.recommendedItems, action.itemId, action.isRecommended)
      };
    case ItemsActionTypes.REMOVE_MOCKED_DATA:
      return {
        ...state,
        recommendedItems: []
      };
    case ItemsActionTypes.RECEIVE_MOCKED_DATA:
      return {
        ...state,
        isLoaded: true,
        recommendedItems: Object.values(action.dataMap).filter(item => item.isRecommended).map(item => item.id)
      };
    case ItemsActionTypes.REMOVE_ITEM:
      return {
        ...state,
        recommendedItems: toggleItemInArray(state.recommendedItems, action.itemId, false)
      };
    default:
      return state;
  }
};
