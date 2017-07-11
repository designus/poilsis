export const getSelectedCity = (citiesState, reqParam) => {
	return new Promise((resolve, reject) => {
		const {aliases} = citiesState;
		const selectedCity = aliases.find(({alias, id}) => alias === reqParam);
		if (selectedCity) {
			resolve(selectedCity);
		} else {
			reject('City is not available');
		}
	});
};

export const getNormalizedData = (data, initial = {dataMap: {}, aliases: []}) => {
	return data.reduce((acc, item) => {
		return {
			...acc,
			dataMap: {
				...acc.dataMap,
				[item.id]: item,
			},
			aliases: [
				...acc.aliases,
				{
					id: item.id,
					alias: item.alias,
				},
			],
		};
	}, initial);
};
