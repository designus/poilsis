import { LocaleActionTypes, ISetClientLocale, ISetAdminLocale } from 'types';

export const setClientLocale = (locale: string): ISetClientLocale => ({
  type: LocaleActionTypes.SET_CLIENT_LOCALE,
  locale
});

export const setAdminLocale = (locale: string): ISetAdminLocale => ({
  type: LocaleActionTypes.SET_ADMIN_LOCALE,
  locale
});

export const switchLanguage = (locale: string, isAdmin: boolean) => dispatch => {
  if (isAdmin) {
    dispatch(setAdminLocale(locale));
  } else {
    dispatch(setClientLocale(locale));
  }
};
