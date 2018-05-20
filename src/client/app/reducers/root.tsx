import { combineReducers } from 'redux';
import { TItemState } from 'pages';
import {
  cities,
  types,
  items,
  initialData,
  loader,
  ILoadingState,
  toast,
  auth,
  ICityState,
  IInitialDataState,
  IToastState,
  IAuthState,
  IItemsState,
  users,
  IUsersState,
} from '../reducers';

import { uploadProgress, IUploadProgress } from './uploadProgress';
import { user, IUserState } from './user';
export interface IAppState {
  cities: ICityState;
  auth: IAuthState;
  global: any;
  user: IUserState;
  users: IUsersState;
  items: IItemsState;
  newItem: TItemState;
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
  user,
  users,
});
