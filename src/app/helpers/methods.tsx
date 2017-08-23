import { ValueType, IKeyMap, IGenericState, IGenericDataMap, TGenericFormModel } from './types';
import { IItemsMap, ICityItems, ICityState } from '../reducers';

export const getSelectedCity = (citiesState: ICityState, reqParam: string) => {
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

export const getGroupedItemsByCityId = (dataMap: IGenericDataMap<IItemsMap>) => {
	return Object.keys(dataMap).reduce((acc: ICityItems, itemId: string) => {
		const item: IItemsMap = dataMap[itemId];
		const state = acc[item.city];
		if (state) {
			state.push(itemId);
		} else {
			acc[item.city] = [];
		}
		return acc;
	}, {});
};

export const getNormalizedData = (data: any[], initial = {dataMap: {}, aliases: []}) => {
	return data.reduce((acc: IGenericState<object>, item: any) => {
		acc.dataMap[item.id] = item;
		acc.aliases.push({id: item.id, alias: item.alias});
		return acc;
	}, initial);
};

export const getFormFieldsFromModel = (model: TGenericFormModel<object>) => {
	return Object.keys(model).reduce((acc: {[key: string]: any}, key: string) => {
		acc[key] = model[key].value;
		return acc;
	}, {});
};

export const getValidationErrors = (fields: object, model: TGenericFormModel<object>) => {
	return Object.keys(model).reduce((errors, key: string) => {
		const validationMsg = model[key].validators.reduce((acc: string[], errorMessageFn) => {
			const getErrorMsg = errorMessageFn(fields[key], fields);
			return getErrorMsg
				? [...acc, getErrorMsg(model[key].title)]
				: [...acc];
		}, []);

		return {...errors, [key]: validationMsg};

	}, {});
};

export const getKeyMap = (value: ValueType, title: string, validators: any[]): IKeyMap => {
	return { value, title, validators };
};
