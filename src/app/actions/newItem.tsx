import axios from 'axios';
import { responseSuccess, responseFailure } from './global';
import { receiveItem } from './items';
import { addItemToCity } from './cities';
import { getMergedErrors } from '../helpers';

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

export const postItem = (item) => {

	return (dispatch, getState) => {

		return axios.post('http://localhost:3000/api/items', item)
			.then(item => item.data)
			.then(item => {
				if (item.errors) {
					const validationErrors = getMergedErrors(item.errors, getState().newItem.errors);
					dispatch(showBackendValidationErrors(validationErrors));
				} else {
					dispatch(receiveItem(item));
					dispatch(addItemToCity(item.city, item.id));
					dispatch(clearFields());
					dispatch(responseSuccess());
				}
			})
			.catch(err => {
				console.error(err);
				dispatch(responseFailure(err));
			});
	};
};
