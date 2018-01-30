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

export interface IRoute {
  path: string;
  getLink: (arg1?, arg2?, arg3?) => string;
  getComponent?: () => any;
}

export type RouteKeys = 'landing'|'items'|'item'|'createItem'|'createItemMain'|'editItem'|'editItemMain'|'editItemPhotos';

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
    path: '/admin/items/create',
    getLink: () => '/admin/items/create',
    getComponent: () => CreateEditItemPage,
  },
  createItemMain: {
    path: '/admin/items/create/main',
    getLink: () => '/admin/items/create/main',
    getComponent: () => MainInfoPage,
  },
  editItem: {
    path: '/admin/items/edit/:id',
    getLink: (id) => `/admin/items/edit/${id}`,
    getComponent: () => CreateEditItemPage,
  },
  editItemMain: {
    path: '/admin/items/edit/:id/main',
    getLink: (id) => `/admin/items/edit/${id}/main`,
    getComponent: () => MainInfoPage,
  },
  editItemPhotos: {
    path: '/admin/items/edit/:id/photos',
    getLink: (id) => `/admin/items/edit/${id}/photos`,
    getComponent: () => PhotosPage,
  },
};
