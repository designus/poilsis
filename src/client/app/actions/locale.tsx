import { Languages } from 'global-utils/typings';
import { LocaleActionTypes, ISetClientLocale, ISetAdminLocale } from 'types';

export const setClientLocale = (locale: Languages): ISetClientLocale => ({
  type: LocaleActionTypes.SET_CLIENT_LOCALE,
  locale
});

export const setAdminLocale = (locale: Languages): ISetAdminLocale => ({
  type: LocaleActionTypes.SET_ADMIN_LOCALE,
  locale
});

export const switchLanguage = (locale: Languages, isAdmin: boolean) => dispatch => {
  if (isAdmin) {
    dispatch(setAdminLocale(locale));
  } else {
    dispatch(setClientLocale(locale));
  }
};
