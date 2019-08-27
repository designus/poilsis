import { Reducer } from 'redux';
import { ItemsActionTypes, ItemsActions } from 'actions/items';

export interface IHomeState {
  isLoaded: boolean;
  recommendedItems: string[];
}

const getInitialState = (): IHomeState => ({
  isLoaded: false,
  recommendedItems: []
});

export const home: Reducer<IHomeState, ItemsActions> = (state = getInitialState(), action) => {
  switch (action.type) {
    case ItemsActionTypes.RECEIVE_ITEMS:
      return {
        ...state,
        isLoaded: true
      };
    default:
      return state;
  }
};
