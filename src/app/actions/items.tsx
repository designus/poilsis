import { addItemsToCity } from './cities';
import { startRequest, responseSuccess, responseFailure } from './global';
import { getNormalizedData, getGroupedItemsByCityId } from '../helpers';

export const SELECT_ITEM = 'SELECT_ITEM';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const RECEIVE_ITEM = 'RECEIVE_ITEM';

export const selectItem = (id) => {
	return {
		type: SELECT_ITEM,
		itemId: id,
	};
};

export const receiveItems = (dataMap, aliases) => {
	return {
		type: RECEIVE_ITEMS,
		dataMap,
		aliases,
	};
};

export const receiveItem = (item) => {
	return {
		type: RECEIVE_ITEM,
		item,
	};
};

export const fetchItems = (cityId) => {

	return (dispatch) => {

		dispatch(startRequest());
		return fetch(`http://localhost:3000/api/items/city/${cityId}`)
			.then(data => data.json())
			.then(data => {

				const { dataMap, aliases } = getNormalizedData(data);

				const groupedItems = cityId ? {[cityId]: Object.keys(dataMap)} : getGroupedItemsByCityId(dataMap);
				console.log('Grouped items', groupedItems);
				const itemIds = Object.keys(dataMap);

				dispatch(receiveItems(dataMap, aliases));
				dispatch(addItemsToCity(cityId, itemIds));
				dispatch(responseSuccess());

			})
			.catch(err => {
				console.error(err);
				dispatch(responseFailure(err));
			});
	};
};
