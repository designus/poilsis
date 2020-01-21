import { ICityState } from './cities';
import { IAuthState } from './auth';
import { ICurrentUserState } from './currentUser';
import { IUsersState } from './users';
import { IItemsState } from './items';
import { ITypesState } from './types';
import { IInitialDataState } from './initialData';
import { ILoadingState } from './loader';
import { IToastState } from './toast';
import { ILocaleState } from './locale';
import { IUploadProgressState } from './uploadProgress';
import { IHomeState } from './home';

export interface IAppState {
  cities: ICityState;
  home: IHomeState;
  auth: IAuthState;
  locale: ILocaleState;
  currentUser: ICurrentUserState;
  users: IUsersState;
  items: IItemsState;
  types: ITypesState;
  initialData: IInitialDataState;
  loader: ILoadingState;
  toast: IToastState;
  uploadProgress: IUploadProgressState;
  form: any;
  loadingBar: any;
}
