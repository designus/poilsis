import {combineReducers} from 'redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import { cities, ICityState } from './cities';
import { types } from './types';
import { items, IItemsState } from './items';
import { newItem } from './newItem';
import { initialData, IInitialDataState } from './initialData';
import { TItemState } from '../containers';
import { loader, ILoadingState } from './loader';
import { toast, IToastState } from './toast';

export interface IAppState {
  cities: ICityState;
  global: any;
  items: IItemsState;
  newItem: TItemState;
  reduxAsyncConnect: any;
  types: any;
  initialData: IInitialDataState;
  loader: ILoadingState;
  toast: IToastState;
}

export const rootReducer = combineReducers({
  cities,
  types,
  items,
  newItem,
  reduxAsyncConnect,
  initialData,
  loader,
  toast,
});