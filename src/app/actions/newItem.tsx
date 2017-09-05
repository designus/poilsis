import axios from 'axios';

import { getMergedErrors } from '../helpers';
import { responseSuccess, responseFailure, receiveItem, addItemToCity, startLoading, endLoading } from '../actions';

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

export const postItem = (item, loaderId) => {

	return (dispatch, getState) => {

		dispatch(startLoading(loaderId));

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
			})
			.then(() => {
				dispatch(endLoading(loaderId));
			});
	};
};
