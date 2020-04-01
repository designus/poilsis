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
import { initialData, getInitialDataState } from './initialData';
import { items, getInitialItemsState } from './items';
import { cities, getInitialCitiesState } from './cities';
import { loader } from './loader';
import { types, getInitialTypesState } from './types';
import { uploadProgress } from './uploadProgress';
import { currentUser } from './currentUser';
import { users } from './users';
import { locale } from './locale';
import { home, getInitialHomeState } from './home';
import { filters } from './filters';

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
  filters,
  form: formReducer,
  loadingBar: loadingBarReducer
});

// @ts-ignore
export const rootReducer: Reducer<IAppState, ActionTypes> = (state: IAppState, action) => {
  if (action.type === InitialDataActionTypes.CLEAR_ALL_DATA) {
    state = {
      ...state,
      cities: getInitialCitiesState(),
      types: getInitialTypesState(),
      items: getInitialItemsState(),
      initialData: getInitialDataState(),
      home: getInitialHomeState()
    };
  }

  return appReducer(state, action);
};
