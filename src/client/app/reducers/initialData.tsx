import { Reducer } from 'redux';
import { InitialDataActionTypes, InitialDataActions, IInitialDataState } from 'types';

const getInitialState = (): IInitialDataState => ({
  isLoaded: false,
  isMultiLang: false
});

export const initialData: Reducer<IInitialDataState, InitialDataActions> =
(state = getInitialState(), action): IInitialDataState => {
  switch (action.type) {
    case InitialDataActionTypes.RECEIVE_INITIAL_DATA:
      return {
        ...state,
        isLoaded: true,
        isMultiLang: action.isLoggedIn
      };
    default:
      return state;
  }
};
