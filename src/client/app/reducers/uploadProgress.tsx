import { SET_UPLOAD_PROGRESS, UPLOAD_SUCCESS, UPLOAD_ERROR, RESET_UPLOAD_STATE } from 'actions/upload';
import { InitialDataActionTypes, InitialDataActions } from 'actions/initialData';

export interface IUploadProgress {
  progress?: number;
  isUploaded?: boolean;
  hasError?: boolean;
  isUploading?: boolean;
}

const getInitialState = () => ({
  progress: 0,
  isUploaded: false,
  hasError: false,
  isUploading: false
});

export const uploadProgress = (state: IUploadProgress = getInitialState(), action): IUploadProgress => {
  switch (action.type) {
    case RESET_UPLOAD_STATE:
    case InitialDataActionTypes.CLEAR_STATE:
      return getInitialState();
    case SET_UPLOAD_PROGRESS:
      return {
        progress: action.progress,
        isUploaded: false,
        hasError: false,
        isUploading: true
      };
    case UPLOAD_SUCCESS:
      return {
        progress: 0,
        isUploaded: true,
        hasError: false,
        isUploading: false
      };
    case UPLOAD_ERROR:
      return {
        progress: 0,
        isUploaded: false,
        hasError: true,
        isUploading: false
      };
    default:
      return state;
  }
};
