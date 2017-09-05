import {
	SELECT_CITY,
	ADD_ITEM_TO_CITY,
	REMOVE_ITEM_FROM_CITY,
	ADD_ITEMS,
	RECEIVE_INITIAL_DATA,
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

export const cities = (state: ICityState = null, action): ICityState => {
	switch (action.type) {
		case SELECT_CITY:
			return {...state, selectedId: action.cityId};
		case RECEIVE_INITIAL_DATA:
			return {...state, ...action.data.cities, items: {}};
		case ADD_ITEMS:
			return {...state, items: {...state.items, ...action.items}};
		case ADD_ITEM_TO_CITY:
			const cityItemsState = [...(state.items[action.cityId] || []), action.itemId];
			return {
				...state,
				items: {
					...state.items,
					[action.cityId]: cityItemsState.filter(removeDuplicates),
				},
			};
		case REMOVE_ITEM_FROM_CITY:
			const cityItems = [...state.items[action.cityId]].filter(itemId => itemId !== action.itemId);
			return {
				...state,
				items: {
					...state.items,
					[action.cityId]: cityItems,
				},
			};
		default:
			return state;
	}
};
