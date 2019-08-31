import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { IItemsState, ICityState, ITypesState, ICurrentUserState, IAuthState, IUsersState, IInitialDataState } from 'types';
import {
  cities,
  items,
  initialData,
  toast,
  auth,
  IToastState
} from '../reducers';

import { loader, ILoadingState } from './loader';
import { types } from './types';
import { uploadProgress, IUploadProgress } from './uploadProgress';
import { currentUser } from './currentUser';
import { users } from './users';
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
