import { addItemsToCitiesState } from './cities';
import { startRequest, responseSuccess, responseFailure } from './global';
import { getNormalizedData, getGroupedItemsByCityId } from '../helpers';
import { IGenericDataMap, IAlias } from '../typeDefinitions';
import { IItemsMap } from '../reducers';

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

export const fetchItems = (cityId = null) => {

	const endpoint = cityId	?
		`http://localhost:3000/api/items/city/${cityId}` :
		'http://localhost:3000/api/items';

	return (dispatch) => {

		dispatch(startRequest());
		return fetch(endpoint)
			.then(data => data.json())
			.then(data => {

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
