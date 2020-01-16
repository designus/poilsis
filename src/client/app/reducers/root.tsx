import { combineReducers, Reducer } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { loadingBarReducer } from 'react-redux-loading-bar';

import {
  IAppState,
  ItemsActions,
  InitialDataActions,
  AuthActions,
  CitiesActions,
  CurrentUserActions,
  LoaderActions,
  LocaleActions,
  ToastActions,
  TypesActions,
  UploadActions,
  InitialDataActionTypes
} from 'types';

import { auth } from './auth';
import { toast } from './toast';
import { initialData } from './initialData';
import { items } from './items';
import { cities } from './cities';
import { loader } from './loader';
import { types } from './types';
import { uploadProgress } from './uploadProgress';
import { currentUser } from './currentUser';
import { users } from './users';
import { locale } from './locale';
import { home } from './home';

type ActionTypes = ItemsActions
  | InitialDataActions
  | AuthActions
  | CitiesActions
  | CurrentUserActions
  | LoaderActions
  | LocaleActions
  | ToastActions
  | TypesActions
  | UploadActions;

const appReducer = combineReducers<IAppState>({
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
  form: formReducer,
  loadingBar: loadingBarReducer
});

export const rootReducer: Reducer<IAppState, ActionTypes> = (state: IAppState, action) => {
  if (action.type === InitialDataActionTypes.CLEAR_ALL_DATA) {
    state = {
      ...state,
      cities: undefined,
      types: undefined,
      items: undefined,
      initialData: undefined,
      home: undefined
    };
  }

  return appReducer(state, action);
};
