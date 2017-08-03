import {RECEIVE_TYPES, SELECT_TYPE} from '../actions/types';

export const types = (state = null, action) => {
	switch (action.type) {
		case RECEIVE_TYPES:
			return {...state, ...action.payload};
		case SELECT_TYPE:
			return {...state, selectedId: action.typeId};
		default:
			return state;
	}
};
