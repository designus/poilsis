export const SELECT_TYPE = 'SELECT_TYPE';

export const selectType = (id) => {
	return {
			type: SELECT_TYPE,
			typeId: id,
	};
};
