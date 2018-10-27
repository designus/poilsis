import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { rootReducer } from 'reducers';
const initialState = typeof window !== 'undefined' ? (window as any).__INITIAL_STATE__ : {};
export const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunkMiddleware)),
);
