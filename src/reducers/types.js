import {RECEIVE_TYPES, SELECT_TYPE, REQUEST_TYPES} from '../actions/types';

const types = (state = null, action) => {
	switch(action.type) {
		case RECEIVE_TYPES:
			return {...state, ...action.payload};
			break;
		case SELECT_TYPE: 
			return {...state, selectedId: action.typeId}
			break;
		default:
			return state;
	}
}

export default types; 