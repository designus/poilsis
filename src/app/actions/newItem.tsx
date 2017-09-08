export const ADD_NEW_ITEM_STATE = 'ADD_NEW_ITEM_STATE';
export const CLEAR_FIELDS = 'CLEAR_FIELDS';
export const RECEIVE_NEW_ITEM = 'RECEIVE_ITEM';
export const SHOW_BACKEND_VALIDATION_ERRORS = 'SHOW_BACKEND_VALIDATION_ERRORS';

export const addNewItemState = (state) => {
	return {
		type: ADD_NEW_ITEM_STATE,
		state,
	};
};

export const clearFields = () => {
	return {
		type: CLEAR_FIELDS,
	};
};

export const showBackendValidationErrors = (errors) => {
	return {
		type: SHOW_BACKEND_VALIDATION_ERRORS,
		errors,
	};
};
