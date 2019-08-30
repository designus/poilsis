import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { IItemsState, ICityState, ITypesState } from 'types';
import {
  cities,
  items,
  initialData,
  toast,
  auth,
  IInitialDataState,
  IToastState,
  IAuthState
} from '../reducers';

import { loader, ILoadingState } from './loader';
import { types } from './types';
import { uploadProgress, IUploadProgress } from './uploadProgress';
import { currentUser, ICurrentUserState } from './currentUser';
import { users, IUsersState } from './users';
import { locale } from './locale';

export interface IAppState {
  cities: ICityState;
  auth: IAuthState;
  locale: string;
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
  locale,
  users,
  form: formReducer
});
