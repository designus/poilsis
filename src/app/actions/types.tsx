import { getNormalizedData } from '../helpers';
import { responseSuccess, responseFailure } from './global';

export const SELECT_TYPE = 'SELECT_TYPE';
export const RECEIVE_TYPES = 'RECEIVE_TYPES';

export const selectType = (id) => {
	return {
			type: SELECT_TYPE,
			typeId: id,
	};
};

export const receiveTypes = (payload) => {
	return {
		type: RECEIVE_TYPES,
		payload,
	};
};

export const fetchTypes = () => {

	return (dispatch) => {

		return fetch(`http://localhost:3000/api/types`)
			.then(types => types.json())
			.then(types => {
				dispatch(receiveTypes(getNormalizedData(types)));
				dispatch(responseSuccess());
			})
			.catch(err => {
				console.error(err);
				dispatch(responseFailure(err));
			});
	};
};
