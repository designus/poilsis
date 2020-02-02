import { Locale } from 'global-utils/typings';
import { LocaleActionTypes, ISetClientLocale, ISetAdminLocale, ActionCreator, ThunkResult } from 'types';
import { clearAllData } from './initialData';

export const setClientLocale: ActionCreator<ISetClientLocale> = params => ({
  type: LocaleActionTypes.SET_CLIENT_LOCALE,
  ...params
});

export const setAdminLocale: ActionCreator<ISetAdminLocale> = params => ({
  type: LocaleActionTypes.SET_ADMIN_LOCALE,
  ...params
});

export const switchLanguage = (locale: Locale, isAdmin: boolean): ThunkResult<void> => dispatch => {
  if (isAdmin) {
    dispatch(setAdminLocale({ locale }));
  } else {
    dispatch(setClientLocale({ locale }));
    dispatch(clearAllData());
  }
};
