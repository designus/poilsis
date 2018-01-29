import { App } from './pages';
import { adminRoutes, clientRoutes } from './client-utils';

export const routes = [
  {
    component: App,
    routes: [
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
    ],
  },
];

// export default (
//   <Route>
//     <Route path={adminRoutes.landing.path} component={adminRoutes.landing.component}>
//       <Route path={adminRoutes.items.path} component={adminRoutes.items.component} />
//       <Route path={adminRoutes.createItem.path} component={adminRoutes.createItem.component} >
//         <Route path={adminRoutes.createItemMain.path} component={adminRoutes.createItemMain.component} />
//       </Route>
//       <Route path={adminRoutes.editItem.path} component={adminRoutes.editItem.component} >
//         <Route path={adminRoutes.editItemMain.path} component={adminRoutes.editItemMain.component} />
//         <Route path={adminRoutes.editItemPhotos.path} component={adminRoutes.editItemPhotos.component} />
//       </Route>
//     </Route>
//     <Route component={ClientLayoutPage}>
//       <Route path="/" component={HomePage} />
//       <Route path="/pasiskelbti" component={AddItemPage} />
//       <Route path="/:city" component={CityPage} />
//       <Route path="/:city/:type" component={TypePage} />
//       <Route path="/:city/:type/:item" component={ItemPage} />
//     </Route>
//   </Route>
// );
