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

				if (!selectedCity) {
					return Promise.resolve();
				} else if (selectedCity && !selectedCity.isItemsLoaded) {
					return store.dispatch(fetchItems(id));
				} else {
					return Promise.resolve(selectedCity.items);
				}
		}).catch((e) => {
			console.error('Err', e);
			return Promise.resolve();
		});
	},
}])
class CityPageComponent extends React.Component<any, any> {

	render() {

		const selectedCity = this.props.selectedCity;

		if (selectedCity) {
			return (
				<div>
					<h1>{selectedCity.name}</h1>
					<p>{selectedCity.description}</p>
					{selectedCity.isItemsLoaded ? <ItemsList {...this.props} /> : ''}
				</div>
			);
		} else {
			return <NotFoundPage/>;
		}
	}
}

const mapStateToProps = (state) => {
	return {
		selectedCity: state.cities.dataMap[state.cities.selectedId],
		itemsMap: state.items.dataMap,
		typesMap: state.types.dataMap,
	};
};

export const CityPage = connect(mapStateToProps)(CityPageComponent);
