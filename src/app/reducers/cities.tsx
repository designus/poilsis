import { RECEIVE_CITIES, SELECT_CITY, ADD_ITEM_TO_CITY, ADD_ITEMS } from '../actions/cities';
import { IGenericState } from '../typeDefinitions';

export interface ICityMap {
	id: string;
	alias: string;
	description: string;
	name: string;
	types: string[];
	items?: string[];
	isItemsLoaded?: boolean;
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
			const itemsState = state.dataMap[action.cityId].items || [];
			return {
				...state,
				dataMap: {
					...state.dataMap,
					[action.cityId]: {
						...state.dataMap[action.cityId],
						items: [
							...itemsState,
							action.itemId,
						],
					},
				},
			};
		default:
			return state;
	}
};
