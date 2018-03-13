import { combineReducers } from 'redux';
import { TItemState } from 'pages';
import { cities, ICityState } from './cities';
import { types } from './types';
import { items, IItemsState } from './items';
// import { newItem } from './newItem';
import { initialData, IInitialDataState } from './initialData';
import { loader, ILoadingState } from './loader';
import { toast, IToastState } from './toast';
import { uploadProgress, IUploadProgress  } from './uploadProgress';
import { auth, IAuthState } from './auth';

export interface IAppState {
  cities: ICityState;
  auth: IAuthState;
  global: any;
  items: IItemsState;
  newItem: TItemState;
  reduxAsyncConnect: any;
  types: any;
  initialData: IInitialDataState;
  loader: ILoadingState;
  toast: IToastState;
  uploadProgress: IUploadProgress;
}

export const rootReducer = combineReducers({
  cities,
  types,
  auth,
  items,
  // newItem,
  initialData,
  loader,
  toast,
  uploadProgress,
});
