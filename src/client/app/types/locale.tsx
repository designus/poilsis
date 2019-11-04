import { Languages } from 'global-utils/typings';

export interface ILocaleState {
  client: Languages;
  admin: Languages;
}

export enum LocaleActionTypes {
  SET_CLIENT_LOCALE = 'SET_CLIENT_LOCALE',
  SET_ADMIN_LOCALE = 'SET_ADMIN_LOCALE'
}

export interface ISetClientLocale {
  type: LocaleActionTypes.SET_CLIENT_LOCALE;
  locale: Languages;
}

export interface ISetAdminLocale {
  type: LocaleActionTypes.SET_ADMIN_LOCALE;
  locale: Languages;
}

export type LocaleActions = ISetClientLocale | ISetAdminLocale;
