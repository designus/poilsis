export const SELECT_CITY = 'SELECT_CITY';
export const ADD_ITEM_TO_CITY = 'ADD_ITEM_TO_CITY';
export const REMOVE_ITEM_FROM_CITY = 'REMOVE_ITEM_FROM_CITY';
export const ADD_ITEMS = 'ADD_ITEMS';

export const selectCity = (id) => {
	return {
		type: SELECT_CITY,
		cityId: id,
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
