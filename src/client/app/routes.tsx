import { App } from './pages';
import { adminRoutes, clientRoutes } from './client-utils';

export const routes = [
  {
    component: App,
    routes: [
      {
        path: adminRoutes.landing.path,
        component: adminRoutes.landing.getComponent(),
        exact: false,
        routes: [
          {
            path: adminRoutes.items.path,
            component: adminRoutes.items.getComponent(),
            exact: true,
          },
          {
            path: adminRoutes.createItem.path,
            component: adminRoutes.createItem.getComponent(),
            exact: false,
            routes: [
              {
                path: adminRoutes.createItemMain.path,
                component: adminRoutes.createItemMain.getComponent(),
                exact: false,
              },
            ],
          },
          {
            path: adminRoutes.editItem.path,
            component: adminRoutes.editItem.getComponent(),
            exact: false,
            routes: [
              {
                path: adminRoutes.editItemMain.path,
                component: adminRoutes.editItemMain.getComponent(),
                exact: false,
              },
              {
                path: adminRoutes.editItemPhotos.path,
                component: adminRoutes.editItemPhotos.getComponent(),
                exact: false,
              },
            ],
          },
        ],
      },
      {
        path: clientRoutes.landing.path,
        component: clientRoutes.landing.getComponent(),
        exact: false,
        routes: [
          {
            path: clientRoutes.items.path,
            component: clientRoutes.items.getComponent(),
            exact: true,
          },
          {
            path: clientRoutes.item.path,
            component: clientRoutes.item.getComponent(),
            exact: true,
          },
        ],
      },
    ],
  },
];
