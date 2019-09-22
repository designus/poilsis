import { UserRoles, TranslatableField } from 'global-utils/typings';

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
    getLink: (locale: string) => string
  };
  landing: {
    path: string,
    getLink: (locale: string) => string
  };
  items: {
    path: string,
    getLink: (locale: string, cityAlias: TranslatableField) => string
  };
  item: {
    path: string,
    getLink: (locale: string, cityAlias: TranslatableField, itemAlias: TranslatableField) => string
  };
}

export const clientRoutes: IRoutesConfig = {
  login: {
    path: '/:locale(lt|en|ru)?/login',
    getLink: (locale: string) => `/${locale}/login`
  },
  landing: {
    path: '/:locale(lt|en|ru)?',
    getLink: (locale: string) => `/${locale}`
  },
  items: {
    path: '/:locale(lt|en|ru)/:cityAlias',
    getLink: (locale: string, cityAlias: TranslatableField) => `/${locale}/${cityAlias[locale]}`
  },
  item: {
    path: '/:locale(lt|en|ru)/:cityAlias/:itemAlias',
    getLink: (locale: string, cityAlias: TranslatableField, itemAlias: TranslatableField) =>
      `/${locale}/${cityAlias[locale]}/${itemAlias[locale]}`
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
