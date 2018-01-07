import * as React from 'react';
import { Route } from 'react-router';

import {
  AddItemPage,
  CityPage,
  ClientLayoutPage,
  HomePage,
  TypePage,
  ItemPage,
} from './pages';

import { adminRoutes } from './client-utils';

export default (
  <Route>
    <Route path={adminRoutes.landing.path} component={adminRoutes.landing.component}>
      <Route path={adminRoutes.items.path} component={adminRoutes.items.component} />
      <Route path={adminRoutes.createItem.path} component={adminRoutes.createItem.component} >
        <Route path={adminRoutes.createItemMain.path} component={adminRoutes.createItemMain.component} />
      </Route>
      <Route path={adminRoutes.editItem.path} component={adminRoutes.editItem.component} >
        <Route path={adminRoutes.editItemMain.path} component={adminRoutes.editItemMain.component} />
        <Route path={adminRoutes.editItemPhotos.path} component={adminRoutes.editItemPhotos.component} />
      </Route>
    </Route>
    <Route component={ClientLayoutPage}>
      <Route path="/" component={HomePage} />
      <Route path="/pasiskelbti" component={AddItemPage} />
      <Route path="/:city" component={CityPage} />
      <Route path="/:city/:type" component={TypePage} />
      <Route path="/:city/:type/:item" component={ItemPage} />
    </Route>
  </Route>
);
