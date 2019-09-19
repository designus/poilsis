import { Reducer } from 'redux';
import { Toast, IToastState, ToastActionTypes, ToastActions, InitialDataActionTypes, InitialDataActions } from 'types';

type ActionTypes = ToastActions | InitialDataActions;

const getInitialState = (): IToastState => ({
  show: false,
  message: '',
  toastType: Toast.success,
  error: null
});

export const toast: Reducer<IToastState, ActionTypes> = (state: IToastState = getInitialState(), action): IToastState => {
  switch (action.type) {
    case ToastActionTypes.SHOW_TOAST:
      return {
        ...state,
        toastType: action.toastType,
        message: action.message,
        error: action.error,
        show: true
      };
    case ToastActionTypes.HIDE_TOAST:
      return {
        ...state,
        show: false,
        error: null
      };
    default:
      return state;
  }
};
