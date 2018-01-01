import { SET_UPLOAD_PROGRESS, UPLOAD_SUCCESS, UPLOAD_ERROR, SET_INITIAL_UPLOAD_STATE } from '../actions';

export interface IUploadProgress {
  progress?: number;
  isUploaded?: boolean;
  hasError?: boolean;
  isUploading?: boolean;
};

const initialState = {
  progress: 0,
  isUploaded: false,
  hasError: false,
  isUploading: false,
};

export const uploadProgress = (state: IUploadProgress = initialState, action): IUploadProgress => {
  switch (action.type) {
    case SET_INITIAL_UPLOAD_STATE:
      return {...initialState};
    case SET_UPLOAD_PROGRESS:
      return {
        progress: action.progress,
        isUploaded: false,
        hasError: false,
        isUploading: true,
      };
    case UPLOAD_SUCCESS:
      return {
        progress: 0,
        isUploaded: true,
        hasError: false,
        isUploading: false,
      };
    case UPLOAD_ERROR:
      return {
        progress: 0,
        isUploaded: false,
        hasError: true,
        isUploading: false,
      };
    default:
      return state;
  }
};
