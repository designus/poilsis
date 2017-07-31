import {RECEIVE_CITIES, SELECT_CITY, ADD_ITEMS_TO_CITY, ADD_ITEM_TO_CITY } from '../actions/cities';
import {IGenericState} from '../typeDefinitions';
import {uniq} from 'lodash';

export interface ICityMap {
	id: string;
	alias: string;
	description: string;
	name: string;
	types: string[];
	items?: string[];
	isItemsLoaded?: boolean;
}

export interface ICityState extends IGenericState<ICityMap> {
	selectedId: string;
};

const cities = (state: ICityState = null, action): ICityState => {
	switch (action.type) {
		case SELECT_CITY:
			return {...state, selectedId: action.cityId};
		case RECEIVE_CITIES:
			return {...state, ...action.payload};
		case ADD_ITEMS_TO_CITY:
			const items = state.dataMap[action.cityId].items || [];
			const newItems = uniq([...items, ...action.items]);
			return {
				...state,
				dataMap: {
					...state.dataMap,
					[action.cityId]: {
						...state.dataMap[action.cityId],
						isItemsLoaded: true,
						items: [...newItems],
					},
				},
			};
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

export default cities;
