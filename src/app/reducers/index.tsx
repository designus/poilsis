import {combineReducers} from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import { cities, ICityState } from './cities';
import { types } from './types';
import { items, IItemsState } from './items';
import { newItem, INewItemState } from './newItem';
import { global } from './global';

export * from './cities';
export * from './types';
export * from './items';
export * from './newItem';
export * from './global';

export interface IAppState {
	cities: ICityState;
	global: any;
	items: IItemsState;
	newItem: INewItemState;
	reduxAsyncConnect: any;
	types: any;
}

const rootReducer = combineReducers({
	cities,
	types,
	items,
	newItem,
	global,
	reduxAsyncConnect,
});

export default rootReducer;
