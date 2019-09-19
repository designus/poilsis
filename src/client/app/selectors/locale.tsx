import { IAppState } from 'types';

export const getClientLocale = (state: IAppState) => state.locale.client;

export const getAdminLocale = (state: IAppState) => state.locale.admin;
