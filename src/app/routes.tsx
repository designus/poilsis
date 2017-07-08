import * as React from 'react';

import {IndexRoute, Route} from 'react-router';
import LayoutPage from './containers/layoutPage';
import CityPage from './containers/cityPage';
import IndexPage from './components/indexPage';
import TypePage from './components/typePage';
import ItemPage from './components/itemPage';
import AddItemPage from './containers/addItemPage';

export default (
	<Route path="/" component={LayoutPage}>
		<IndexRoute component={IndexPage} />
		<Route path="/pasiskelbti" component={AddItemPage} />
		<Route path="/:city" component={CityPage} />
		<Route path="/:city/:type" component={TypePage} />
		<Route path="/:city/:type/:item" component={ItemPage} />
	</Route>
);
