import { SELECT_TYPE, RECEIVE_INITIAL_DATA } from '../actions';
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
		case RECEIVE_INITIAL_DATA:
			return {...state, ...action.data.types};
		case SELECT_TYPE:
			return {...state, selectedId: action.typeId};
		default:
			return state;
	}
};
