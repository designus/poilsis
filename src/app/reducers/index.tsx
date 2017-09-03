import {combineReducers} from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import { cities, ICityState } from './cities';
import { types } from './types';
import { items, IItemsState } from './items';
import { newItem } from './newItem';
import { response } from './response';
import { initialData, IInitialDataState } from './initialData';
import { TItemState } from '../containers';
import { loader, ILoadingState } from './loader';

export * from './cities';
export * from './types';
export * from './items';
export * from './newItem';
export * from './response';
export * from './initialData';

export interface IAppState {
	cities: ICityState;
	global: any;
	items: IItemsState;
	newItem: TItemState;
	reduxAsyncConnect: any;
	types: any;
	initialData: IInitialDataState;
	loader: ILoadingState;
}

const rootReducer = combineReducers({
	cities,
	types,
	items,
	newItem,
	response,
	reduxAsyncConnect,
	initialData,
	loader,
});

export default rootReducer;
