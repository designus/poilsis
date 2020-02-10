import { ToastType, ToastActionTypes, IShowToast, IHideToast } from 'types';

export const showToast = (toastType: ToastType, message: string, error?: string): IShowToast => ({
  type: ToastActionTypes.SHOW_TOAST,
  toastType,
  message,
  error: error || null
});

export const hideToast = (): IHideToast => ({
  type: ToastActionTypes.HIDE_TOAST
});
