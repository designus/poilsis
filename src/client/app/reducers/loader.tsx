import {START_LOADING, END_LOADING, STOP_ALL_LOADERS} from '../actions';

export interface ILoadingState {
  [key: string]: {
    isLoading: boolean,
  };
}

export const getLoadingState = (state: ILoadingState, id: string, isLoading: boolean) => {
  return {
    ...state,
    [id]: {
      isLoading,
    },
  };
};

export const loader = (state: ILoadingState = {}, action) => {
  switch (action.type) {
    case START_LOADING:
      return getLoadingState(state, action.id, true);
    case END_LOADING:
      return getLoadingState(state, action.id, false);
    case STOP_ALL_LOADERS:
      return Object.keys(state).reduce((acc, loaderId) => {
        acc[loaderId] = false;
        return acc;
      }, {});
    default:
      return state;
  }
};
