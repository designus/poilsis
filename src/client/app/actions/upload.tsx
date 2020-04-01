import { UploadActionTypes } from 'types';

export const setUploadProgress = (progress: number) => ({
  type: UploadActionTypes.SET_UPLOAD_PROGRESS,
  progress
}) as const;

export const uploadSuccess = () => ({
  type: UploadActionTypes.UPLOAD_SUCCESS
}) as const;

export const uploadError = () => ({
  type: UploadActionTypes.UPLOAD_ERROR
}) as const;

export const resetUploadState = () => ({
  type: UploadActionTypes.RESET_UPLOAD_STATE
}) as const;
