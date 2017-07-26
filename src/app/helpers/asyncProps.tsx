import {fetchCities} from '../actions/cities';
import {fetchTypes} from '../actions/types';

export const typesProps = {
	key: 'types',
	promise: ({params, store}) => {

		const typesState = store.getState().types;

		if (!typesState) {
			return store.dispatch(fetchTypes());
		} else {
			return Promise.resolve(typesState);
		}
	},
};

export const citiesProps = {
	key: 'cities',
	promise: ({params, store}) => {

		const citiesState = store.getState().cities;

		if (!citiesState) {
			return store.dispatch(fetchCities());
		} else {
			return Promise.resolve(citiesState);
		}
	},
};
