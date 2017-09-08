import {
	SELECT_CITY,
	ADD_ITEM_TO_CITY,
	ADD_ITEMS,
	RECEIVE_INITIAL_DATA,
	CHANGE_ITEM_CITY,
} from '../actions';
import { IGenericState, removeDuplicates } from '../helpers';

export interface ICityMap {
	id: string;
	alias: string;
	description: string;
	name: string;
	types: string[];
}

export interface ICityItems {
	[key: string]: string[];
}

export interface ICityState extends IGenericState<ICityMap> {
	selectedId?: string;
	items?: ICityItems;
};

export function getCitiesItemState(cityItems: ICityItems, {fromCityId, toCityId, itemId}) {

	const fromCityState = [...cityItems[fromCityId]].filter(id => id !== itemId);
	const toCityState = [...(cityItems[toCityId] || []), itemId].filter(removeDuplicates);

	return {
		[fromCityId]: fromCityState,
		[toCityId]: toCityState,
	};
}

export const cities = (state: ICityState = null, action): ICityState => {
	switch (action.type) {
		case SELECT_CITY:
			return {...state, selectedId: action.cityId};
		case RECEIVE_INITIAL_DATA:
			return {...state, ...action.data.cities, items: {}};
		case ADD_ITEMS:
			return {...state, items: {...state.items, ...action.items}};
		case CHANGE_ITEM_CITY:
			return {
				...state,
				items: {
					...state.items,
					...getCitiesItemState(state.items, action),
				},
			};
		case ADD_ITEM_TO_CITY:
			const cityItemsState = [...(state.items[action.cityId] || []), action.itemId];
			return {
				...state,
				items: {
					...state.items,
					[action.cityId]: cityItemsState.filter(removeDuplicates),
				},
			};
		default:
			return state;
	}
};
