import * as React from 'react';
import {connect} from 'react-redux';
import { asyncConnect} from 'redux-connect';

import {fetchItems} from '../actions/items';
import {selectCity} from '../actions/cities';
import {getSelectedCity} from '../helpers';

import NotFoundPage from '../components/notFoundPage';
import ItemsList from '../components/itemsList';

@asyncConnect([{
	key: 'items',
	promise: ({params, store}) => {

		const citiesState = store.getState().cities;

		return getSelectedCity(citiesState, params.city)
			.then(({id}) => {
				store.dispatch(selectCity(id));
				const selectedCity = citiesState.dataMap[id];
				const selectedCityItems = citiesState.items[id] || [];

				if (!selectedCity) {
					return Promise.resolve();
				} else if (selectedCity && selectedCityItems.length === 0) {
					return store.dispatch(fetchItems(id));
				} else {
					return Promise.resolve(selectedCityItems);
				}
		}).catch((e) => {
			console.error('Err', e);
			return Promise.resolve();
		});
	},
}])
class CityPageComponent extends React.Component<any, any> {

	render() {

		const {selectedCity, cityItems, itemsMap, typesMap} = this.props;

		if (selectedCity) {
			return (
				<div>
					<h1>{selectedCity.name}</h1>
					<p>{selectedCity.description}</p>
					{cityItems.length ? <ItemsList items={cityItems} itemsMap={itemsMap} typesMap={typesMap} /> : ''}
				</div>
			);
		} else {
			return <NotFoundPage/>;
		}
	}
}

const mapStateToProps = (state) => {
	console.log('State', state);
	const selectedCityId = state.cities.selectedId;
	const cityItems = state.cities.items[selectedCityId] || [];
	return {
		selectedCity: state.cities.dataMap[selectedCityId],
		itemsMap: state.items.dataMap,
		cityItems,
		typesMap: state.types.dataMap,
	};
};

export const CityPage = connect(mapStateToProps)(CityPageComponent);
