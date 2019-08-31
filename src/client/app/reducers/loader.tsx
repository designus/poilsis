import { Reducer } from 'redux';
import { LoaderActionTypes, LoaderActions, ILoadingState } from 'types';

const getInitialData = (): ILoadingState => ({
  content: false,
  dialog: false,
  global: false
});

export const loader: Reducer<ILoadingState, LoaderActions> =
(state: ILoadingState = getInitialData(), action): ILoadingState => {
  switch (action.type) {
    case LoaderActionTypes.START_LOADING:
      return {
        ...state,
        [action.loaderId]: true
      };
    case LoaderActionTypes.END_LOADING:
      return getInitialData();
    default:
      return state;
  }
};
