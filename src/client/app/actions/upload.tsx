import { UploadActionTypes, ISetUploadProgress, IUploadSuccess, IUploadError, IResetUploadState } from 'types';

export const setUploadProgress = (progress: number): ISetUploadProgress => ({
  type: UploadActionTypes.SET_UPLOAD_PROGRESS,
  progress
});

export const uploadSuccess = (): IUploadSuccess => ({
  type: UploadActionTypes.UPLOAD_SUCCESS
});

export const uploadError = (): IUploadError => ({
  type: UploadActionTypes.UPLOAD_ERROR
});

export const resetUploadState = (): IResetUploadState => ({
  type: UploadActionTypes.RESET_UPLOAD_STATE
});
