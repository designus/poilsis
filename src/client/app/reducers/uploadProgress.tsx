import { Reducer } from 'redux';
import { UploadActionTypes, UploadActions, IUploadProgressState, InitialDataActionTypes, InitialDataActions } from 'types';

type ActionTypes = UploadActions | InitialDataActions;

const getInitialState = (): IUploadProgressState => ({
  progress: 0,
  isUploaded: false,
  hasError: false,
  isUploading: false
});

export const uploadProgress: Reducer<IUploadProgressState, ActionTypes> =
  (state: IUploadProgressState = getInitialState(), action): IUploadProgressState => {
  switch (action.type) {
    case UploadActionTypes.RESET_UPLOAD_STATE:
    case InitialDataActionTypes.CLEAR_STATE:
      return getInitialState();
    case UploadActionTypes.SET_UPLOAD_PROGRESS:
      return {
        progress: action.progress,
        isUploaded: false,
        hasError: false,
        isUploading: true
      };
    case UploadActionTypes.UPLOAD_SUCCESS:
      return {
        progress: 0,
        isUploaded: true,
        hasError: false,
        isUploading: false
      };
    case UploadActionTypes.UPLOAD_ERROR:
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
