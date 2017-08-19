import {RECEIVE_TYPES, SELECT_TYPE} from '../actions/types';
import { IGenericState } from '../helpers';

export interface ITypesMap {
	id: string;
	alias: string;
	description: string;
	name: string;
}

export interface ITypesState extends IGenericState<ITypesMap> {}

export const types = (state: ITypesState = null, action) => {
	switch (action.type) {
		case RECEIVE_TYPES:
			return {...state, ...action.payload};
		case SELECT_TYPE:
			return {...state, selectedId: action.typeId};
		default:
			return state;
	}
};
