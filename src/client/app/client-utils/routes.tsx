import {
  AdminLayoutPage,
  AdminItemsPage,
  CreateEditItemPage,
  CreateEditTypePage,
  AdminTypesPage,
  AdminCitiesPage,
  MainInfoPage,
  PhotosPage,
  ClientLayoutPage,
  CityPage,
  ItemPage,
} from 'pages';
import { UserRoles } from 'global-utils';

export interface IRoute {
  path: string;
  getLink: (arg1?, arg2?, arg3?) => string;
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
    path: '/',
    getLink: () => '/',
    getComponent: () => ClientLayoutPage,
  },
  items: {
    path: '/:cityName',
    getLink: (cityName) => `/${cityName}`,
    getComponent: () => CityPage,
  },
  item: {
    path: '/:cityName/:item',
    getLink: (cityName, itemName) => `/${cityName}/${itemName}`,
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
    path: '/admin/item/edit/:userId/:itemId',
    getLink: (userId, itemId) => `/admin/item/edit/${userId}/${itemId}`,
    getComponent: () => MainInfoPage,
  },
  editItemPhotos: {
    path: '/admin/item/edit/userId/:itemId/photos',
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
};
