import { ToastType, ToastActionTypes } from 'types';

export const showToast = (toastType: ToastType, message: string, error?: string | null) => ({
  type: ToastActionTypes.SHOW_TOAST,
  toastType,
  message,
  error: error || null
}) as const;

export const hideToast = () => ({
  type: ToastActionTypes.HIDE_TOAST
}) as const;
