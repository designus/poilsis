import * as React from 'react';

import {Route} from 'react-router';
import IndexPage from './components/indexPage';
import TypePage from './components/typePage';
import ItemPage from './components/itemPage';
import { AddItemPage,	CityPage,	ClientPage, AdminPage } from './containers';

export default (
	<Route>
		<Route path="/admin" component={AdminPage}>
			<Route path="/admin/items" />
			<Route path="/admin/items/create" />
			<Route path="/admin/items/edit/:id" />
		</Route>
		<Route component={ClientPage}>
			<Route path="/" component={IndexPage} />
			<Route path="/pasiskelbti" component={AddItemPage} />
			<Route path="/:city" component={CityPage} />
			<Route path="/:city/:type" component={TypePage} />
			<Route path="/:city/:type/:item" component={ItemPage} />
		</Route>
	</Route>
);
