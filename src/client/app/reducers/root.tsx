import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import {
  cities,
  items,
  initialData,
  toast,
  auth
} from '../reducers';

import { loader } from './loader';
import { types } from './types';
import { uploadProgress } from './uploadProgress';
import { currentUser } from './currentUser';
import { users } from './users';
import { locale } from './locale';
import { home } from './home';

export const rootReducer = combineReducers({
  cities,
  types,
  auth,
  items,
  initialData,
  loader,
  home,
  toast,
  uploadProgress,
  currentUser,
  locale,
  users,
  form: formReducer
});
