import { SET_UPLOAD_PROGRESS, UPLOAD_SUCCESS, UPLOAD_ERROR } from '../actions';

export interface IUploadProgress {
  progress?: number;
  isUploaded?: boolean;
  isError?: boolean;
  isUploading?: boolean;
};

const initialState = {
  progress: 0,
  isUploaded: false,
  isError: false,
  isUploading: false,
};

export const uploadProgress = (state: IUploadProgress = initialState, action): IUploadProgress => {
  switch (action.type) {
    case SET_UPLOAD_PROGRESS:
      return {
        progress: action.progress,
        isUploaded: false,
        isError: false,
        isUploading: true,
      };
    case UPLOAD_SUCCESS:
      return {
        progress: 0,
        isUploaded: true,
        isError: false,
        isUploading: false,
      };
    case UPLOAD_ERROR:
      return {
        progress: 0,
        isUploaded: false,
        isError: true,
        isUploading: false,
      };
    default:
      return state;
  }
};
