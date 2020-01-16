import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { RouteConfig } from 'react-router-config';
import { IAppState } from 'types';
import { App } from 'pages';

import { AdminLayoutPage } from 'pages/admin/layout';
import { AdminItemsPage } from 'pages/admin/items';
import { loadUserItemsData } from 'pages/admin/items/items';
import { CreateEditItemPage } from 'pages/admin/createEditItem';
import { CreateEditTypePage } from 'pages/admin/createEditType';
import { CreateEditCityPage } from 'pages/admin/createEditCity';
import { AdminTypesPage } from 'pages/admin/types';
import { AdminCitiesPage } from 'pages/admin/cities';
import { ClientLayoutPage } from 'pages/client/layout';
import { CityPage } from 'pages/client/city';
import { ItemPage } from 'pages/client/item';
import { MainInfoPage } from 'pages/admin/createEditItem/mainInfo';
import { DescriptionPage } from 'pages/admin/createEditItem/description';
import { PhotosPage } from 'pages/admin/createEditItem/photos';
import { adminRoutes, clientRoutes } from 'client-utils/routes';
import { getInitialData } from 'actions/initialData';

import { loadCityData } from './pages/client/city/city';
import { loadItemData } from './pages/client/item/item';
import { loadRecommendedItemsData } from './pages/client/home/recommendedItems/recommendedItems';

const loadInitialData = (store, params) => store.dispatch(getInitialData({ locale: params.locale }));

export interface IRoute extends RouteConfig {
  fetchData?: () => ThunkAction<Promise<void>, IAppState, void, Action>;
}

export const routes = [
  {
    component: App,
    routes: [
      {
        path: adminRoutes.landing.path,
        component: AdminLayoutPage,
        fetchData: loadInitialData,
        exact: false,
        routes: [
          {
            path: adminRoutes.items.path,
            component: AdminItemsPage,
            fetchData: loadUserItemsData,
            exact: true
          },
          {
            path: adminRoutes.createItem.path,
            component: CreateEditItemPage,
            exact: false,
            routes: [
              {
                path: adminRoutes.createItemMain.path,
                component: MainInfoPage,
                exact: false
              }
            ]
          },
          {
            path: adminRoutes.editItem.path,
            component: CreateEditItemPage,
            exact: false,
            routes: [
              {
                path: adminRoutes.editItemMain.path,
                component: MainInfoPage,
                exact: false
              },
              {
                path: adminRoutes.editItemDescription.path,
                component: DescriptionPage,
                exact: false
              },
              {
                path: adminRoutes.editItemPhotos.path,
                component: PhotosPage,
                exact: false
              }
            ]
          }
        ]
      },
      {
        path: clientRoutes.landing.path,
        component: ClientLayoutPage,
        fetchData: [loadInitialData, loadRecommendedItemsData],
        exact: false,
        routes: [
          {
            path: clientRoutes.items.path,
            component: CityPage,
            fetchData: loadCityData,
            exact: true
          },
          {
            path: clientRoutes.item.path,
            component: ItemPage,
            fetchData: loadItemData,
            exact: true
          }
        ]
      }
    ]
  }
];
