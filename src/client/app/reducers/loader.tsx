import { CONTENT_LOADER_ID, DIALOG_LOADER_ID, GLOBAL_LOADER_ID } from 'client-utils';
import { START_LOADING, END_LOADING, STOP_ALL_LOADERS } from 'actions';

export interface ILoadingState {
  content: boolean;
  dialog: boolean;
  global: boolean;
}

const getInitialData = () => ({
  [CONTENT_LOADER_ID]: false,
  [DIALOG_LOADER_ID]: false,
  [GLOBAL_LOADER_ID]: false,
});

export const loader = (state: ILoadingState = getInitialData(), action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        [action.id]: true,
      };
    case END_LOADING:
      return getInitialData();
    case STOP_ALL_LOADERS:
      return getInitialData();
    default:
      return state;
  }
};
