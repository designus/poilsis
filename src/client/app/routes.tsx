import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { RouteConfig } from 'react-router-config';
import { IAppState } from 'reducers';
import { App } from './pages';
import { loadInitialData } from './pages/client/layout/layout';
import { loadCityData } from './pages/client/city/city';
import { loadItemData } from './pages/client/item/item';

import { adminRoutes, clientRoutes, RoutesConfig } from './client-utils';

export interface IRoute extends RouteConfig {
  fetchData?: () => ThunkAction<Promise<void>, IAppState, void, Action>;
}

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
                path: adminRoutes.editItemDescription.path,
                component: adminRoutes.editItemDescription.getComponent(),
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
        fetchData: loadInitialData,
        exact: false,
        routes: [
          {
            path: clientRoutes.items.path,
            component: clientRoutes.items.getComponent(),
            fetchData: loadCityData,
            exact: true,
          },
          {
            path: clientRoutes.item.path,
            component: clientRoutes.item.getComponent(),
            fetchData: loadItemData,
            exact: true,
          },
        ],
      },
    ],
  },
];
