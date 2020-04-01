import { batch } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { LoaderActionTypes, LoaderType, ThunkResult } from 'types';

export const startLoading = (loaderId: LoaderType) => ({
  type: LoaderActionTypes.START_LOADING,
  loaderId
}) as const;

export const endLoading = (loaderId: LoaderType) => ({
  type: LoaderActionTypes.END_LOADING,
  loaderId
}) as const;

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
