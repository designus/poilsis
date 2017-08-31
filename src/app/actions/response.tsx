export const RESPONSE_SUCCESS = 'RESPONSE_SUCCESS';
export const RESPONSE_FAILURE = 'RESPONSE_FAILURE';

export const responseSuccess = (message = '', isVisible = false) => {
	return {
		type: RESPONSE_SUCCESS,
		message,
		isVisible,
	};
};

export const responseFailure = (message = '', isVisible = false) => {
	return {
		type: RESPONSE_FAILURE,
		message,
		isVisible,
	};
};
