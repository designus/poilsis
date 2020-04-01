import { Locale } from 'global-utils/typings';
import { setClientLocale, setAdminLocale } from 'actions/locale';

export interface ILocaleState {
  client: Locale;
  admin: Locale;
}

export enum LocaleActionTypes {
  SET_CLIENT_LOCALE = 'SET_CLIENT_LOCALE',
  SET_ADMIN_LOCALE = 'SET_ADMIN_LOCALE'
}

export type LocaleActions = ReturnType<typeof setClientLocale> | ReturnType<typeof setAdminLocale>;
