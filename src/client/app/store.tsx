import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { rootReducer } from '../app/reducers';
const initialState = typeof window !== 'undefined' ? (window as any).__INITIAL_STATE__ : {};
export const store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware, logger));
