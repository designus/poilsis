import {
  AdminLayoutPage,
  AdminItemsPage,
  CreateEditItemPage,
  MainInfoPage,
  PhotosPage,
  ClientLayoutPage,
} from '../pages';

export interface IRoute {
  path: string;
  getLink: (arg1?, arg2?, arg3?) => string;
  getComponent?: () => any;
  isExact: boolean;
}

export type RouteKeys = 'landing'|'items'|'createItem'|'createItemMain'|'editItem'|'editItemMain'|'editItemPhotos';

export type RoutesConfig = {
  [P in RouteKeys]?: IRoute;
};

export const clientRoutes: RoutesConfig = {
  landing: {
    path: '/',
    getLink: () => '/',
    getComponent: () => ClientLayoutPage,
    isExact: true,
  },
};

export const adminRoutes: RoutesConfig = {
  landing: {
    path: '/admin',
    getLink: () => '/admin',
    getComponent: () => AdminLayoutPage,
    isExact: false,
  },
  items: {
    path: '/admin/items',
    getLink: () => '/admin/items',
    getComponent: () => AdminItemsPage,
    isExact: false,
  },
  createItem: {
    path: '/admin/items/create',
    getLink: () => '/admin/items/create',
    getComponent: () => CreateEditItemPage,
    isExact: false,
  },
  createItemMain: {
    path: '/admin/items/create/main',
    getLink: () => '/admin/items/create/main',
    getComponent: () => MainInfoPage,
    isExact: false,
  },
  editItem: {
    path: '/admin/items/edit/:id',
    getLink: (id) => `/admin/items/edit/${id}`,
    getComponent: () => CreateEditItemPage,
    isExact: false,
  },
  editItemMain: {
    path: '/admin/items/edit/:id/main',
    getLink: (id) => `/admin/items/edit/${id}/main`,
    getComponent: () => MainInfoPage,
    isExact: false,
  },
  editItemPhotos: {
    path: '/admin/items/edit/:id/photos',
    getLink: (id) => `/admin/items/edit/${id}/photos`,
    getComponent: () => PhotosPage,
    isExact: false,
  },
};
