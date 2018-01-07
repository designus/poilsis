import {
  AdminLayoutPage,
  AdminItemsPage,
  CreateEditItemPage,
  MainInfoPage,
  PhotosPage,
} from '../pages';

export interface IRoute {
  path: string;
  getLink: (arg1?, arg2?, arg3?) => string;
  component: any;
}

export type RouteKeys = 'landing'|'items'|'createItem'|'createItemMain'|'editItem'|'editItemMain'|'editItemPhotos';

export type RoutesConfig = {
  [P in RouteKeys]?: IRoute;
};

export const adminRoutes: RoutesConfig = {
  landing: {
    path: '/admin',
    getLink: () => '/admin',
    component: AdminLayoutPage,
  },
  items: {
    path: '/admin/items',
    getLink: () => '/admin/items',
    component: AdminItemsPage,
  },
  createItem: {
    path: '/admin/items/create',
    getLink: () => '/admin/items/create',
    component: CreateEditItemPage,
  },
  createItemMain: {
    path: '/admin/items/create/main',
    getLink: () => '/admin/items/create/main',
    component: MainInfoPage,
  },
  editItem: {
    path: '/admin/items/edit/:id',
    getLink: (id) => `/admin/items/edit/${id}`,
    component: CreateEditItemPage,
  },
  editItemMain: {
    path: '/admin/items/edit/:id/main',
    getLink: (id) => `/admin/items/edit/${id}/main`,
    component: MainInfoPage,
  },
  editItemPhotos: {
    path: '/admin/items/edit/:id/photos',
    getLink: (id) => `/admin/items/edit/${id}/photos`,
    component: PhotosPage,
  },
};
