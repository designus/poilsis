import { START_LOADING, END_LOADING, STOP_ALL_LOADERS } from 'actions';

export interface ILoadingState {
  content: boolean;
  dialog: boolean;
  global: boolean;
}

const getInitialData = () => ({
  content: false,
  dialog: false,
  global: false
});

export const loader = (state: ILoadingState = getInitialData(), action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        [action.id]: true
      };
    case END_LOADING:
      return getInitialData();
    case STOP_ALL_LOADERS:
      return getInitialData();
    default:
      return state;
  }
};
