import { RECEIVE_INITIAL_DATA } from '../actions';

export interface IInitialDataState {
  isLoaded: boolean;
}

export const initialData = (state: IInitialDataState = {isLoaded: false}, action) => {
  switch (action.type) {
    case RECEIVE_INITIAL_DATA:
      return {...state, isLoaded: true };
    default:
      return state;
  }
};
