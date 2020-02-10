
export enum Toast {
  warning = 'warning',
  error = 'error',
  success = 'success'
}

export type ToastType = Toast.warning | Toast.error | Toast.success;

export interface IToastState {
  toastType: ToastType;
  message: string;
  show: boolean;
  error: string | null;
}

export enum ToastActionTypes {
  SHOW_TOAST = 'SHOW_TOAST',
  HIDE_TOAST = 'HIDE_TOAST'
}

export interface IShowToast {
  type: ToastActionTypes.SHOW_TOAST;
  toastType: ToastType;
  message: string;
  error: string | null;
}

export interface IHideToast {
  type: ToastActionTypes.HIDE_TOAST;
}

export type ToastActions = IShowToast | IHideToast;
