import { ICityState } from './cities';
import { IAuthState } from './auth';
import { ICurrentUserState } from './currentUser';
import { IUsersState } from './users';
import { IItemsState } from './items';
import { ITypesState } from './types';
import { IInitialDataState } from './initialData';
import { ILoadingState } from './loader';
import { IToastState } from './toast';
import { IUploadProgressState } from './uploadProgress';

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
  uploadProgress: IUploadProgressState;
}
