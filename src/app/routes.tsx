import * as React from 'react';
import {Route} from 'react-router';

import {
	AddItemPage,
	CityPage,
	ClientLayoutPage,
	AdminLayoutPage,
	AdminHomePage,
	AdminItemsPage,
	CreateEditItemPage,
	IndexPage,
	TypePage,
	ItemPage,
} from './containers';

export default (
	<Route>
		<Route path="/admin" component={AdminLayoutPage}>
			<Route path="/admin/home" component={AdminHomePage} />
			<Route path="/admin/items" component={AdminItemsPage} />
			<Route path="/admin/items/create" component={CreateEditItemPage} />
			<Route path="/admin/items/edit/:id" component={CreateEditItemPage}  />
		</Route>
		<Route component={ClientLayoutPage}>
			<Route path="/" component={IndexPage} />
			<Route path="/pasiskelbti" component={AddItemPage} />
			<Route path="/:city" component={CityPage} />
			<Route path="/:city/:type" component={TypePage} />
			<Route path="/:city/:type/:item" component={ItemPage} />
		</Route>
	</Route>
);
