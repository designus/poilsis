import { ValueType, IKeyMap, IGenericState, IGenericDataMap, TGenericFormModel, IGenericFormState  } from './types';
import { IItemsMap, ICityItems, ICityState } from '../reducers';

export function getSelectedCity(citiesState: ICityState, reqParam: string) {
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

export function getGroupedItemsByCityId(dataMap: IGenericDataMap<IItemsMap>) {
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

export function getNormalizedData(data: any[], initial = {dataMap: {}, aliases: []}) {
	return data.reduce((acc: IGenericState<object>, item: any) => {
		acc.dataMap[item.id] = item;
		acc.aliases.push({id: item.id, alias: item.alias});
		return acc;
	}, initial);
};

export function getFormFieldsFromModel(model: TGenericFormModel<object>) {
	return Object.keys(model).reduce((acc: {[key: string]: any}, key: string) => {
		const modelKeyValue = model[key].value;
		let newValue;
		if (Array.isArray(modelKeyValue)) {
			newValue = [...modelKeyValue];
		} else if (typeof modelKeyValue === 'object' && modelKeyValue !== null) {
			newValue = {...modelKeyValue};
		} else {
			newValue = modelKeyValue;
		}
		acc[key] = newValue;
		return acc;
	}, {});
};

export function getFormStateWithData(data, emptyState: IGenericFormState<object>) {
	const fields = Object.keys(emptyState.fields).reduce((acc, key) => {
		acc[key] = data[key];
		return acc;
	}, {});

	return {...emptyState, fields};
};

export function getInitialFormState(model: TGenericFormModel<object>): IGenericFormState<object> {
	return {
		fields: getFormFieldsFromModel(model),
		errors: {},
		showErrors: false,
		model,
	};
};

export function getValidationErrors(fields: object, model: TGenericFormModel<object>) {
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

export function getKeyMap(value: ValueType, title: string, validators: any[]): IKeyMap {
	return { value, title, validators };
};

export const voidFn = (f) => f;
