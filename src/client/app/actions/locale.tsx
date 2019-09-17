import { clientRoutes } from 'client-utils/routes';

export const SET_LOCALE = 'SET_LOCALE';

export const setLocale = (locale: string) => ({
  type: SET_LOCALE,
  locale
});

export const switchLanguage = (locale: string) => dispatch => {
  dispatch(setLocale(locale));
  window.history.pushState('', '', clientRoutes.landing.getLink(locale));
};
