import { RECEIVE_CITIES, SELECT_CITY, ADD_ITEM_TO_CITY, REMOVE_ITEM_FROM_CITY, ADD_ITEMS } from '../actions/cities';
import { IGenericState } from '../helpers';

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
		case RECEIVE_CITIES:
			return {...state, ...action.payload, items: {}};
		case ADD_ITEMS:
			return {...state, items: {...state.items, ...action.items}};
		case ADD_ITEM_TO_CITY:
			return {
				...state,
				items: {
					...state.items,
					[action.cityId]: [
						...(state.items[action.cityId] || []),
						action.itemId,
					],
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
