import { SET_UPLOAD_PROGRESS, UPLOAD_SUCCESS, UPLOAD_ERROR } from '../actions';

export interface IUploadProgress {
  progress?: number;
  isUploaded?: boolean;
  isError?: boolean;
};

const initialState = {progress: 10, isUploaded: false, isError: false};

export const uploadProgress = (state: IUploadProgress = initialState, action): IUploadProgress => {
  switch (action.type) {
    case SET_UPLOAD_PROGRESS:
      return {
        progress: action.progress,
        isUploaded: false,
        isError: false,
      };
    case UPLOAD_SUCCESS:
      return {
        progress: 10,
        isUploaded: true,
        isError: false,
      };
    case UPLOAD_ERROR:
      return {
        progress: 10,
        isUploaded: false,
        isError: true,
      };
    default:
      return state;
  }
};
