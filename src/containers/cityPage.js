import React from 'react';
import {connect} from 'react-redux';
import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'

import {fetchItems} from '../actions/items';
import {selectCity} from '../actions/cities';
import {selectCityIfValid} from '../helpers'

import NotFoundPage from '../components/notFoundPage';
import ItemsList from '../components/itemsList';

@asyncConnect([{
  key: 'items',
  promise: ({params, store}) => {
		selectCityIfValid(store, params.city);

		const citiesState = store.getState().cities;
		const selectedId = citiesState.selectedId;
		const selectedCity = citiesState.dataMap[selectedId];

		if (!selectedCity) {
			return Promise.resolve();
		} else if (selectedCity && !selectedCity.isItemsLoaded) {
			return store.dispatch(fetchItems(selectedId))
		} else {
			return Promise.resolve(selectedCity.items);
		}
  }
}])
class CityPage extends React.Component {

	render() {

		const selectedCity = this.props.selectedCity;

		if (selectedCity) {
			return (
				<div>
					<h1>{selectedCity.name}</h1>
					<p>{selectedCity.description}</p>
					{selectedCity.isItemsLoaded ? <ItemsList {...this.props} /> : ''}
				</div>
			)
		} else {
			return <NotFoundPage/>
		}
		
	}
}

const mapStateToProps = (state) => {

	return {
		selectedCity: state.cities.dataMap[state.cities.selectedId],
		itemsMap: state.items.dataMap,
		typesMap: state.types.dataMap
	}
}


export default connect(mapStateToProps)(CityPage);
