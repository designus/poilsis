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

export interface ISetUploadProgress {
  type: UploadActionTypes.SET_UPLOAD_PROGRESS;
  progress: number;
}

export interface IUploadSuccess {
  type: UploadActionTypes.UPLOAD_SUCCESS;
}

export interface IUploadError {
  type: UploadActionTypes.UPLOAD_ERROR;
}

export interface IResetUploadState {
  type: UploadActionTypes.RESET_UPLOAD_STATE;
}

export type UploadActions = IUploadSuccess | IUploadError | IResetUploadState | ISetUploadProgress;
