import { Reducer } from 'redux';
import { InitialDataActionTypes, InitialDataActions, IInitialDataState } from 'types';

export const getInitialDataState = (): IInitialDataState => ({
  isLoaded: false,
  isMultiLang: false
});

export const initialData: Reducer<IInitialDataState, InitialDataActions> =
(state = getInitialDataState(), action): IInitialDataState => {
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
