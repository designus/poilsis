import axios from 'axios';
import { responseSuccess, responseFailure } from './response';
import { getNormalizedData } from '../helpers';

export const RECEIVE_INITIAL_DATA = 'RECEIVE_INITIAL_DATA';

export const receiveInitialData = (data) => {
	return {
		type: RECEIVE_INITIAL_DATA,
		data,
	};
};

export const getInitialData = () => {
	return (dispatch) => {
		return axios.all([
			axios.get('http://localhost:3000/api/cities'),
			axios.get('http://localhost:3000/api/types'),
		])
		.then(axios.spread((citiesResponse, typesResponse) => {
			const cities = getNormalizedData(citiesResponse.data);
			const types = getNormalizedData(typesResponse.data);

			dispatch(receiveInitialData({cities, types}));
			responseSuccess();
		}))
		.catch(err => {
			console.error(err);
			dispatch(responseFailure(err));
		});
	};
};
