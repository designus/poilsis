import { SHOW_TOAST, HIDE_TOAST } from '../actions';

export enum Toast {
  warning = 'warning',
  error = 'error',
  success = 'success',
}

export type ToastType = Toast.warning | Toast.error | Toast.success;

export interface IToastState {
  toastType?: ToastType;
  message?: string;
  show?: boolean;
  error?: string;
}

const initialState = {
  show: false,
  message: '',
  toastType: Toast.success,
  error: null,
};

export const toast = (state: IToastState = initialState, action) => {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        ...state,
        toastType: action.toastType,
        message: action.message,
        error: action.error,
        show: true,
      };
    case HIDE_TOAST:
      return {
        ...state,
        show: false,
        error: null,
      };
    default:
      return state;
  }
};
