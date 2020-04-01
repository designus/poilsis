import { Locale } from 'global-utils/typings';
import { LocaleActionTypes, ThunkResult } from 'types';
import { clearAllData } from './initialData';

export const setClientLocale = (locale: Locale) => ({
  type: LocaleActionTypes.SET_CLIENT_LOCALE,
  locale
}) as const;

export const setAdminLocale = (locale: Locale) => ({
  type: LocaleActionTypes.SET_ADMIN_LOCALE,
  locale
}) as const;

export const switchLanguage = (locale: Locale, isAdmin: boolean): ThunkResult<void> => dispatch => {
  if (isAdmin) {
    dispatch(setAdminLocale(locale));
  } else {
    dispatch(setClientLocale(locale));
    dispatch(clearAllData());
  }
};
