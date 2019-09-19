export interface ILocaleState {
  client: string;
  admin: string;
}

export enum LocaleActionTypes {
  SET_CLIENT_LOCALE = 'SET_CLIENT_LOCALE',
  SET_ADMIN_LOCALE = 'SET_ADMIN_LOCALE'
}

export interface ISetClientLocale {
  type: LocaleActionTypes.SET_CLIENT_LOCALE;
  locale: string;
}

export interface ISetAdminLocale {
  type: LocaleActionTypes.SET_ADMIN_LOCALE;
  locale: string;
}

export type LocaleActions = ISetClientLocale | ISetAdminLocale;
