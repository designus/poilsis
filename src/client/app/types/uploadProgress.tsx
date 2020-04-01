import { setUploadProgress, uploadSuccess, uploadError, resetUploadState } from 'actions/upload';

export interface IUploadProgressState {
  progress?: number;
  isUploaded?: boolean;
  hasError?: boolean;
  isUploading?: boolean;
}

export enum UploadActionTypes {
  SET_UPLOAD_PROGRESS = 'SET_UPLOAD_PROGRESS',
  UPLOAD_SUCCESS = 'UPLOAD_SUCCESS',
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  RESET_UPLOAD_STATE = 'RESET_UPLOAD_STATE'
}

export type UploadActions =
  | ReturnType<typeof setUploadProgress>
  | ReturnType<typeof uploadSuccess>
  | ReturnType<typeof uploadError>
  | ReturnType<typeof resetUploadState>;
