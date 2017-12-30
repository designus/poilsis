export const SET_UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const INITIAL_UPLOAD_STATE = 'INITIAL_UPLOAD_STATE';

export const setUploadProgress = (progress: number) => {
  return {
    type: SET_UPLOAD_PROGRESS,
    progress,
  };
};

export const uploadSuccess = () => ({type: UPLOAD_SUCCESS});
export const uploadError = () => ({type: UPLOAD_ERROR});
export const initialUploadState = () => ({type: INITIAL_UPLOAD_STATE});
