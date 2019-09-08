import { Reducer } from 'redux';
import { InitialDataActionTypes, InitialDataActions, IInitialDataState } from 'types';

const getInitialState = (): IInitialDataState => ({
  isLoaded: false
});

export const initialData: Reducer<IInitialDataState, InitialDataActions> =
(state = getInitialState(), action): IInitialDataState => {
  switch (action.type) {
    case InitialDataActionTypes.CLEAR_STATE:
      return getInitialState();
    case InitialDataActionTypes.RECEIVE_INITIAL_DATA:
      return {...state, isLoaded: true };
    default:
      return state;
  }
};
