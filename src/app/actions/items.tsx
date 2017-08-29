import axios from 'axios';

import { addItemsToCitiesState, addItemToCity, removeItemFromCity } from './cities';
import { startRequest, responseSuccess, responseFailure } from './global';
import { getNormalizedData, getGroupedItemsByCityId, IGenericDataMap, IAlias /*getMergedErrors */ } from '../helpers';
import { IItemsMap, IAppState } from '../reducers';

export const SELECT_ITEM = 'SELECT_ITEM';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';
export const RECEIVE_ITEM = 'RECEIVE_ITEM';

export const selectItem = (id: string) => {
	return {
		type: SELECT_ITEM,
		itemId: id,
	};
};

export const receiveItems = (dataMap: IGenericDataMap<IItemsMap>, aliases: IAlias[], allItemsLoaded: boolean) => {
	return {
		type: RECEIVE_ITEMS,
		dataMap,
		aliases,
		allItemsLoaded,
	};
};

export const receiveItem = (item) => {
	return {
		type: RECEIVE_ITEM,
		item,
	};
};

export const getItems = (cityId = null) => {
	const endpoint = cityId	?
		`http://localhost:3000/api/items/city/${cityId}` :
		'http://localhost:3000/api/items';

	return (dispatch) => {

		dispatch(startRequest());
		return axios.get(endpoint)
			.then(response => {

				const { data } = response;
				const { dataMap, aliases } = getNormalizedData(data);

				const groupedItems = cityId ? {[cityId]: Object.keys(dataMap)} : getGroupedItemsByCityId(dataMap);
				const allItemsLoaded = !cityId;

				dispatch(receiveItems(dataMap, aliases, allItemsLoaded));
				dispatch(addItemsToCitiesState(groupedItems));
				dispatch(responseSuccess());

			})
			.catch(err => {
				console.error(err);
				dispatch(responseFailure(err));
			});
	};
};

export const getItem = (itemId) => {
	return dispatch => {
		dispatch(startRequest());

		return axios.get(`http://localhost:3000/api/items/item/${itemId}`)
			.then(response => {
				const item = response.data;
				dispatch(receiveItem(item));
				dispatch(addItemToCity(item.city, item.id));
				dispatch(responseSuccess());
			})
			.catch(err => {
				console.error(err);
				dispatch(responseFailure(err));
			});
	};
};

export const putItem = (item, itemId) => {
	return (dispatch, getState) => {

		const appState: IAppState = getState();
		const oldItem = appState.items.dataMap[itemId];

		dispatch(startRequest());

		return axios.put(`http://localhost:3000/api/items/item/${itemId}`, item)
			.then(response => response.data)
			.then(item => {
				return new Promise((resolve) => {
					if (item.errors) {
						resolve(item.errors);
					} else {
						dispatch(receiveItem(item));
						if (oldItem.city !== item.city) {
							dispatch(addItemToCity(item.city, itemId));
							dispatch(removeItemFromCity(oldItem.city, itemId));
						}
						dispatch(responseSuccess());
						resolve();
					}
				});
			})
			.catch(err => {
				console.error(err);
				dispatch(responseFailure(err));
			});

	};
};
