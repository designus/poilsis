import { clearState } from 'actions';
export const SET_LOCALE = 'SET_LOCALE';

export const setLocale = (locale: string) => ({
  type: SET_LOCALE,
  locale,
});

export const switchLanguage = (language: string) => dispatch => {
  dispatch(setLocale(language));
  dispatch(clearState());
};
