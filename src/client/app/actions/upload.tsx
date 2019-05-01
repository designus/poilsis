export const SET_UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const RESET_UPLOAD_STATE = 'RESET_UPLOAD_STATE';

export const setUploadProgress = (progress: number) => (dispatch) => {
  dispatch({
    type: SET_UPLOAD_PROGRESS,
    progress,
  });
};

export const uploadSuccess = () => ({ type: UPLOAD_SUCCESS });
export const uploadError = () => ({ type: UPLOAD_ERROR });
export const resetUploadState = () => ({ type: RESET_UPLOAD_STATE });
