import * as React from 'react';
import {Route} from 'react-router';

import {
	AddItemPage,
	CityPage,
	ClientPage,
	AdminPage,
	AdminItemsPage,
	AdminItemsEditPage,
	IndexPage,
	TypePage,
	ItemPage,
} from './containers';

export default (
	<Route>
		<Route path="/admin" component={AdminPage}>
			<Route path="/admin/items"component={AdminItemsPage} />
			<Route path="/admin/items/create" />
			<Route path="/admin/items/edit/:id" component={AdminItemsEditPage} />
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
