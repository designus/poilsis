import { RESPONSE_SUCCESS, RESPONSE_FAILURE } from '../actions';

export const response = (state = null, action) => {
	switch (action.type) {
		case RESPONSE_SUCCESS:
			return {...state, message: action.message, isVisible: action.isVisible };
		case RESPONSE_FAILURE:
			return {...state, message: action.message, isVisible: action.isVisible };
		default:
			return state;
	}
};
