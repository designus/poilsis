import { UserRoles, TranslatableField, Languages } from 'global-utils/typings';
import { LANGUAGES } from 'global-utils/constants';
import { getLocalizedText } from 'client-utils/methods';

export interface IRoute {
  path: string;
  getLink?: (arg1?, arg2?, arg3?) => string;
  allowedRoles?: string[];
}

export type RouteKeys =
  | 'login'
  | 'landing'
  | 'items'
  | 'item'
  | 'createItem'
  | 'createItemMain'
  | 'editItem'
  | 'editItemMain'
  | 'editItemDescription'
  | 'editItemPhotos'
  | 'types'
  | 'createType'
  | 'editType'
  | 'cities'
  | 'createCity'
  | 'editCity' ;

export type RoutesConfig = {
  [P in RouteKeys]?: IRoute;
};

interface IRoutesConfig {
  login: {
    path: string,
    getLink: (locale: Languages) => string
  };
  landing: {
    path: string,
    getLink: (locale: Languages) => string
  };
  items: {
    path: string,
    getLink: (locale: Languages, cityAlias: TranslatableField | string) => string
  };
  item: {
    path: string,
    getLink: (locale: Languages, cityAlias: TranslatableField | string, itemAlias: TranslatableField | string) => string
  };
}

const locales = LANGUAGES.join('|');

export const clientRoutes: IRoutesConfig = {
  login: {
    path: `/:locale(${locales})?/login`,
    getLink: (locale: string) => `/${locale}/login`
  },
  landing: {
    path: `/:locale(${locales})?`,
    getLink: (locale: string) => `/${locale}`
  },
  items: {
    path: `/:locale(${locales})/:cityAlias`,
    getLink: (locale, cityAlias) => `/${locale}/${getLocalizedText(cityAlias, locale)}`
  },
  item: {
    path: `/:locale(${locales})/:cityAlias/:itemAlias`,
    getLink: (locale, cityAlias, itemAlias) => `/${locale}/${getLocalizedText(cityAlias, locale)}/${getLocalizedText(itemAlias, locale)}`
  }
};

export const adminRoutes: RoutesConfig = {
  landing: {
    path: '/admin',
    getLink: () => '/admin'
  },
  items: {
    path: '/admin/items',
    getLink: () => '/admin/items'
  },
  createItem: {
    path: '/admin/item/create',
    getLink: () => '/admin/item/create'
  },
  createItemMain: {
    path: '/admin/item/create',
    getLink: () => '/admin/item/create'
  },
  editItem: {
    path: '/admin/item/edit/:userId/:itemId',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}`
  },
  editItemMain: {
    path: '/admin/item/edit/:userId/:itemId/main',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}/main`
  },
  editItemDescription: {
    path: '/admin/item/edit/:userId/:itemId/description',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}/description`
  },
  editItemPhotos: {
    path: '/admin/item/edit/:userId/:itemId/photos',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}/photos`
  },
  types: {
    path: '/admin/types',
    getLink: () => '/admin/types',
    allowedRoles: [UserRoles.admin]
  },
  createType: {
    path: '/admin/type/create',
    getLink: () => '/admin/type/create',
    allowedRoles: [UserRoles.admin]
  },
  editType: {
    path: '/admin/type/edit/:typeId',
    getLink: (typeId) => `/admin/type/edit/${typeId}`,
    allowedRoles: [UserRoles.admin]
  },
  cities: {
    path: '/admin/cities',
    getLink: () => '/admin/cities',
    allowedRoles: [UserRoles.admin]
  },
  createCity: {
    path: '/admin/city/create',
    getLink: () => '/admin/city/create',
    allowedRoles: [UserRoles.admin]
  },
  editCity: {
    path: '/admin/city/edit/:cityId',
    getLink: (cityId) => `/admin/city/edit/${cityId}`,
    allowedRoles: [UserRoles.admin]
  }
};
