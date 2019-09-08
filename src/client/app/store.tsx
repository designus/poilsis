import { createStore as createReduxStore, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { rootReducer } from 'reducers';
import { IAppState } from 'types';

export const createStore = (preloadedState?: IAppState) => {
  const middleWares = composeWithDevTools(applyMiddleware(thunkMiddleware));
  return preloadedState
    ? createReduxStore<IAppState, any, any, any>(rootReducer, preloadedState, middleWares)
    : createReduxStore<IAppState, any, any, any>(rootReducer, middleWares);
};
