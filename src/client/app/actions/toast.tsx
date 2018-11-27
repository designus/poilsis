import { ToastType } from '../reducers';
export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';

export const showToast = (toastType: ToastType, message: string, error?: string) => ({
  type: SHOW_TOAST,
  toastType,
  message,
  error,
});

export const hideToast = () => ({type: HIDE_TOAST});
