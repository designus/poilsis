import * as React from 'react';
import { connect } from 'react-redux';
import { asyncConnect} from 'redux-connect';
import { IAppState } from '../../reducers';
import { getItems } from '../../actions/items';
import { selectCity } from '../../actions/cities';
import { getSelectedCity } from '../../helpers';

import { ItemsList, NotFound } from '../../components';

@asyncConnect([{
	key: 'items',
	promise: ({params, store}) => {

		const appState: IAppState = store.getState();
		const citiesState = appState.cities;
		const allItemsLoaded = appState.items.allItemsLoaded;

		return getSelectedCity(citiesState, params.city)
			.then(({id}) => {
				store.dispatch(selectCity(id));
				const selectedCity = citiesState.dataMap[id];

				if (selectedCity && !allItemsLoaded) {
					return store.dispatch(getItems(id));
				} else {
					return Promise.resolve();
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
			return <NotFound/>;
		}
	}
}

const mapStateToProps = (state: IAppState) => {
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
