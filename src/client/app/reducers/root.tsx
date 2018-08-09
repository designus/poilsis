import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import {
  cities,
  items,
  initialData,
  toast,
  auth,
  ICityState,
  IInitialDataState,
  IToastState,
  IAuthState,
  IItemsState,
} from '../reducers';

import { loader, ILoadingState } from './loader';
import { types, ITypesState } from './types';
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
  types: ITypesState;
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
  initialData,
  loader,
  toast,
  uploadProgress,
  currentUser,
  users,
  form: formReducer,
});
