import { batch } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { LoaderActionTypes, IStartLoading, IEndLoading, LoaderType, ThunkResult } from 'types';

export const startLoading = (loaderId: LoaderType): IStartLoading => ({
  type: LoaderActionTypes.START_LOADING,
  loaderId
});

export const endLoading = (loaderId: LoaderType): IEndLoading => ({
  type: LoaderActionTypes.END_LOADING,
  loaderId
});

export const showLoader = (loaderId: LoaderType): ThunkResult<void> => dispatch => {
  batch(() => {
    dispatch(showLoading());
    dispatch(startLoading(loaderId));
  });
};

export const hideLoader = (loaderId: LoaderType): ThunkResult<void> => dispatch => {
  batch(() => {
    dispatch(hideLoading());
    dispatch(endLoading(loaderId));
  });
};
