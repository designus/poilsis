import { Reducer } from 'redux';
import { ItemsActionTypes, ItemsActions, IHomeState } from 'types';

const getInitialState = (): IHomeState => ({
  isLoaded: false,
  recommendedItems: []
});

export const home: Reducer<IHomeState, ItemsActions> = (state = getInitialState(), action) => {
  switch (action.type) {
    case ItemsActionTypes.RECEIVE_RECOMMENDED_ITEMS:
      return {
        ...state,
        isLoaded: true,
        recommendedItems: action.items
      };
    default:
      return state;
  }
};
