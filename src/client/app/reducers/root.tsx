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
} from '../reducers';

import { uploadProgress, IUploadProgress } from './uploadProgress';
import { currentUser, ICurrentUserState } from './currentUser';
import { users, IUsersState } from './users';
export interface IAppState {
  cities: ICityState;
  auth: IAuthState;
  global: any;
  currentUser: ICurrentUserState;
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
  currentUser,
  users,
});
