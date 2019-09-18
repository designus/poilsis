import { Reducer } from 'redux';
import { LocaleActionTypes, LocaleActions, ILocaleState } from 'types';

import { DEFAULT_LANGUAGE } from 'global-utils';

const getInitialState = (): ILocaleState => ({
  client: DEFAULT_LANGUAGE,
  admin: DEFAULT_LANGUAGE
});

export const locale: Reducer<ILocaleState, LocaleActions> = (state = getInitialState(), action): ILocaleState => {
  switch (action.type) {
    case LocaleActionTypes.SET_CLIENT_LOCALE:
      return {
        ...state,
        client: action.locale
      };
    case LocaleActionTypes.SET_ADMIN_LOCALE:
      return {
        ...state,
        admin: action.locale
      };
    default:
      return state;
  }
};
