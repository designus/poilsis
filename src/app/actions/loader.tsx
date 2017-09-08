export const START_LOADING = 'START_LOADING';
export const END_LOADING = 'END_LOADING';

export const startLoading = (id) => {
	return {
		type: START_LOADING,
		id,
	};
};

export const endLoading = (id) => {
	return dispatch => {
		setTimeout(() => {
			dispatch({type: END_LOADING, id});
		}, 300);
	};
};
