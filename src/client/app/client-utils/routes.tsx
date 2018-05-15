import {
  AdminLayoutPage,
  AdminItemsPage,
  CreateEditItemPage,
  MainInfoPage,
  PhotosPage,
  ClientLayoutPage,
  CityPage,
  ItemPage,
} from '../pages';

import { UserRoles } from '../client-utils';

export interface IRoute {
  path: string;
  getLink: (arg1?, arg2?, arg3?) => string;
  getComponent?: () => any;
  allowedRoles?: string[];
}

export type RouteKeys = 'landing'|'items'|'item'|'createItem'|'createItemMain'|'editItem'|'editItemMain'|'editItemPhotos'|'types';

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
    path: '/:city',
    getLink: (city) => `/${city}`,
    getComponent: () => CityPage,
  },
  item: {
    path: '/:city/:item',
    getLink: (city, item) => `/${city}/${item}`,
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
    path: '/admin/item/edit/:id',
    getLink: (id) => `/admin/item/edit/${id}`,
    getComponent: () => CreateEditItemPage,
  },
  editItemMain: {
    path: '/admin/item/edit/:id',
    getLink: (id) => `/admin/item/edit/${id}`,
    getComponent: () => MainInfoPage,
  },
  editItemPhotos: {
    path: '/admin/item/edit/:id/photos',
    getLink: (id) => `/admin/item/edit/${id}/photos`,
    getComponent: () => PhotosPage,
  },
  types: {
    path: '/admin/types',
    getLink: () => '/admin/types',
    allowedRoles: [UserRoles.admin],
  },
};
