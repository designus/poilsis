import { RECEIVE_INITIAL_DATA, CLEAR_STATE } from 'actions/initialData';

export interface IInitialDataState {
  isLoaded: boolean;
}

const getInitialState = () => ({
  isLoaded: false
});

export const initialData = (state: IInitialDataState = getInitialState(), action) => {
  switch (action.type) {
    case CLEAR_STATE:
      return getInitialState();
    case RECEIVE_INITIAL_DATA:
      return {...state, isLoaded: true };
    default:
      return state;
  }
};
