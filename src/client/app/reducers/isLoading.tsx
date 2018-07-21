import { START_LOADING, END_LOADING } from '../actions';

export const isLoading = (state = false, action) => {
  switch (action.type) {
    case START_LOADING:
      return true;
    case END_LOADING:
      return false;
    default:
      return state;
  }
};
