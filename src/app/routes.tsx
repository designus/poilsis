import * as React from 'react';

import {IndexRoute, Route} from 'react-router';
import IndexPage from './components/indexPage';
import TypePage from './components/typePage';
import ItemPage from './components/itemPage';
import { AddItemPage,	CityPage,	LayoutPage } from './containers';

export default (
	<Route path="/" component={LayoutPage}>
		<IndexRoute component={IndexPage} />
		<Route path="/pasiskelbti" component={AddItemPage} />
		<Route path="/:city" component={CityPage} />
		<Route path="/:city/:type" component={TypePage} />
		<Route path="/:city/:type/:item" component={ItemPage} />
	</Route>
);
