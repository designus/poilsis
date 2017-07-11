import {SELECT_ITEM, RECEIVE_ITEMS, RECEIVE_ITEM } from '../actions/items';
import {IAlias} from '../typeDefinitions';

export interface IItemsMap {
	alias: string;
	city: string;
	createdAt: string;
	id: string;
	name: string;
	types: string[];
}

export interface IItemsState {
	aliases: IAlias[];
	dataMap: {
		[key: string]: IItemsMap,
	};
}

const items = (state: IItemsState = {dataMap: {}, aliases: []}, action) => {
	switch (action.type) {
		case SELECT_ITEM:
			return {...state, selectedId: action.itemId};
		case RECEIVE_ITEMS:
			return {
				...state,
				dataMap: { ...state.dataMap, ...action.dataMap },
				aliases: [ ...state.aliases, ...action.aliases ],
			};
		case RECEIVE_ITEM:
			const itemState = state.dataMap[action.item.id] || {};
			return {
				...state,
				dataMap: {
					...state.dataMap,
					[action.item.id]: {
						...itemState,
						...action.item,
						fullInfo: true,
					},
				},
		};
		default:
			return state;
	}
};

export default items;
