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
  IItemsState
} from '../reducers';

import { loader, ILoadingState } from './loader';
import { types, ITypesState } from './types';
import { uploadProgress, IUploadProgress } from './uploadProgress';
import { currentUser, ICurrentUserState } from './currentUser';
import { users, IUsersState } from './users';
import { admin, IAdminState } from './admin';
import { locale } from './locale';

export interface IAppState {
  cities: ICityState;
  auth: IAuthState;
  locale: string;
  admin: IAdminState;
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
  admin,
  items,
  initialData,
  loader,
  toast,
  uploadProgress,
  currentUser,
  locale,
  users,
  form: formReducer
});
