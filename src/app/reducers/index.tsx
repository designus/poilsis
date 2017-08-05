import {combineReducers} from 'redux';
// import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import { cities } from './cities';
import { types } from './types';
import { items } from './items';
import { newItem } from './newItem';
import { global } from './global';

export * from './cities';
export * from './types';
export * from './items';
export * from './newItem';
export * from './global';

const rootReducer = combineReducers({
	cities,
	types,
	items,
	newItem,
	global,
	reduxAsyncConnect,
});

export default rootReducer;
