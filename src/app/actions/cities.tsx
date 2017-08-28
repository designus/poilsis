import { getNormalizedData } from '../helpers';
import { startRequest, responseSuccess, responseFailure } from './global';

export const SELECT_CITY = 'SELECT_CITY';
export const RECEIVE_CITIES = 'RECEIVE_CITIES';
export const ADD_ITEM_TO_CITY = 'ADD_ITEM_TO_CITY';
export const REMOVE_ITEM_FROM_CITY = 'REMOVE_ITEM_FROM_CITY';
export const ADD_ITEMS = 'ADD_ITEMS';

export const selectCity = (id) => {
	return {
		type: SELECT_CITY,
		cityId: id,
	};
};

export const receiveCities = (payload) => {
	return {
		type: RECEIVE_CITIES,
		payload,
	};
};

export const addItemToCity = (cityId, itemId) => {
	return {
		type: ADD_ITEM_TO_CITY,
		cityId,
		itemId,
	};
};

export const removeItemFromCity = (cityId, itemId) => {
	return {
		type: REMOVE_ITEM_FROM_CITY,
		cityId,
		itemId,
	};
};

export const addItemsToCitiesState = (items) => {
	return {
		type: ADD_ITEMS,
		items,
	};
};

export const fetchCities = () => {

	return (dispatch) => {

		dispatch(startRequest());
		return fetch(`http://localhost:3000/api/cities`)
			.then(cities => cities.json())
			.then(cities => {
				dispatch(receiveCities(getNormalizedData(cities)));
				dispatch(responseSuccess());
			})
			.catch(err => {
				console.error(err);
				dispatch(responseFailure(err));
			});
	};
};
