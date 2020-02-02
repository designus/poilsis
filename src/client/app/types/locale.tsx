import { Locale } from 'global-utils/typings';

export interface ILocaleState {
  client: Locale;
  admin: Locale;
}

export enum LocaleActionTypes {
  SET_CLIENT_LOCALE = 'SET_CLIENT_LOCALE',
  SET_ADMIN_LOCALE = 'SET_ADMIN_LOCALE'
}

export interface ISetClientLocale {
  type: LocaleActionTypes.SET_CLIENT_LOCALE;
  locale: Locale;
}

export interface ISetAdminLocale {
  type: LocaleActionTypes.SET_ADMIN_LOCALE;
  locale: Locale;
}

export type LocaleActions = ISetClientLocale | ISetAdminLocale;
