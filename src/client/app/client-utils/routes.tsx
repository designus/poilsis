import {
  AdminLayoutPage,
  AdminItemsPage,
  CreateEditItemPage,
  CreateEditTypePage,
  CreateEditCityPage,
  AdminTypesPage,
  AdminCitiesPage,
  ClientLayoutPage,
  CityPage,
  ItemPage,
} from 'pages';
import { UserRoles } from 'global-utils';

import { MainInfoPage } from '../pages/admin/createEditItem/mainInfo';
import { DescriptionPage } from '../pages/admin/createEditItem/description';
import { PhotosPage } from '../pages/admin/createEditItem/photos';

export interface IRoute {
  path: string;
  getLink?: (arg1?, arg2?, arg3?) => string;
  getComponent?: () => any;
  allowedRoles?: string[];
}

export type RouteKeys =
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

export const clientRoutes: RoutesConfig = {
  landing: {
    path: '/:locale(lt|en|ru)?',
    getLink: (locale: string) => `/${locale}`,
    getComponent: () => ClientLayoutPage,
  },
  items: {
    path: '/:locale(lt|en|ru)/:cityAlias',
    getLink: (locale: string, cityAlias: string) => `/${locale}/${cityAlias}`,
    getComponent: () => CityPage,
  },
  item: {
    path: '/:locale(lt|en|ru)/:cityAlias/:itemAlias',
    getLink: (locale: string, cityAlias: string, itemAlias: string) => `/${locale}/${cityAlias}/${itemAlias}`,
    getComponent: () => ItemPage,
  },
};

export const adminRoutes: RoutesConfig = {
  landing: {
    path: '/admin',
    getLink: () => '/admin',
    getComponent: () => AdminLayoutPage,
  },
  items: {
    path: '/admin/items',
    getLink: () => '/admin/items',
    getComponent: () => AdminItemsPage,
  },
  createItem: {
    path: '/admin/item/create',
    getLink: () => '/admin/item/create',
    getComponent: () => CreateEditItemPage,
  },
  createItemMain: {
    path: '/admin/item/create',
    getLink: () => '/admin/item/create',
    getComponent: () => MainInfoPage,
  },
  editItem: {
    path: '/admin/item/edit/:userId/:itemId',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}`,
    getComponent: () => CreateEditItemPage,
  },
  editItemMain: {
    path: '/admin/item/edit/:userId/:itemId/main',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}/main`,
    getComponent: () => MainInfoPage,
  },
  editItemDescription: {
    path: '/admin/item/edit/:userId/:itemId/description',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}/description`,
    getComponent: () => DescriptionPage,
  },
  editItemPhotos: {
    path: '/admin/item/edit/:userId/:itemId/photos',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}/photos`,
    getComponent: () => PhotosPage,
  },
  types: {
    path: '/admin/types',
    getLink: () => '/admin/types',
    allowedRoles: [UserRoles.admin],
    getComponent: () => AdminTypesPage,
  },
  createType: {
    path: '/admin/type/create',
    getLink: () => '/admin/type/create',
    allowedRoles: [UserRoles.admin],
    getComponent: () => CreateEditTypePage,
  },
  editType: {
    path: '/admin/type/edit/:typeId',
    getLink: (typeId) => `/admin/type/edit/${typeId}`,
    allowedRoles: [UserRoles.admin],
    getComponent: () => CreateEditTypePage,
  },
  cities: {
    path: '/admin/cities',
    getLink: () => '/admin/cities',
    allowedRoles: [UserRoles.admin],
    getComponent: () => AdminCitiesPage,
  },
  createCity: {
    path: '/admin/city/create',
    getLink: () => '/admin/city/create',
    allowedRoles: [UserRoles.admin],
    getComponent: () => CreateEditCityPage,
  },
  editCity: {
    path: '/admin/city/edit/:cityId',
    getLink: (cityId) => `/admin/city/edit/${cityId}`,
    allowedRoles: [UserRoles.admin],
    getComponent: () => CreateEditCityPage,
  },
};
