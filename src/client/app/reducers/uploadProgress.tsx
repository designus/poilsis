import { SET_UPLOAD_PROGRESS, UPLOAD_SUCCESS } from '../actions';

export interface IUploadProgress {
  progress?: number;
  isUploaded?: boolean;
};

const initialState = {progress: 10, isUploaded: false};

export const uploadProgress = (state: IUploadProgress = initialState, action): IUploadProgress => {
  switch (action.type) {
    case SET_UPLOAD_PROGRESS:
      return {
        progress: action.progress,
        isUploaded: false,
      };
    case UPLOAD_SUCCESS:
      return {
        progress: 10,
        isUploaded: true,
      };
    default:
      return state;
  }
};
