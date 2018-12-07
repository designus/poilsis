import { DEFAULT_LANGUAGE } from 'global-utils';
import { SET_LOCALE } from 'actions';

export const locale = (state: string = DEFAULT_LANGUAGE, action) => {
  switch (action.type) {
    case SET_LOCALE:
      return action.locale;
    default:
      return state;
  }
};