import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import {
  cities,
  types,
  items,
  initialData,
  isLoading,
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
  types: any;
  initialData: IInitialDataState;
  isLoading: boolean;
  toast: IToastState;
  uploadProgress: IUploadProgress;
}

export const rootReducer = combineReducers({
  cities,
  types,
  auth,
  items,
  initialData,
  isLoading,
  toast,
  uploadProgress,
  currentUser,
  users,
  form: formReducer,
});
