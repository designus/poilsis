import { Toast } from '../reducers';
import { showToast } from './toast';
import { endLoading } from './loader';

export const stopLoading = (isError, toastMessage, loaderId) => dispatch => {
  const toastType = isError ? Toast.error : Toast.success;
  dispatch(endLoading(loaderId));
  dispatch(showToast(toastType, toastMessage));
};

export const handleApiErrors = (message, loaderId, dispatch) => err => {
  console.error(err);
  dispatch(stopLoading(true, message, loaderId));
  return Promise.reject(err);
};
