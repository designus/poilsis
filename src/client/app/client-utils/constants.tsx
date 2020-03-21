import { ICityFilters } from 'global-utils/typings';

export const UPLOADED_ANIMATION_DURATION = 2000;
export const CONTENT_LOADER_ID = 'content';
export const DIALOG_LOADER_ID = 'dialog';

export const DEFAULT_CITY_FITLERS: ICityFilters = {
  type: '',
  price: {
    from: null,
    to: null
  }
};
