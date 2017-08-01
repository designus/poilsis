import { NewItemModelType } from '../components/addItemForm';
import { INewItemFields, NewItemErrorsType } from '../reducers/newItem';
import { ValueType, IKeyMap, IGenericState } from '../typeDefinitions';

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

export const getNormalizedData = (data: any[], initial: IGenericState<object> = {dataMap: {}, aliases: []}) => {
	return data.reduce((acc: IGenericState<object>, item: any) => {
		acc.dataMap[item.id] = item;
		acc.aliases.push({id: item.id, alias: item.alias});
		return acc;
	}, initial);
};

export const getNewItemFieldsFromModel = (model: NewItemModelType): INewItemFields => {
	return Object.keys(model).reduce((acc: INewItemFields, key: string) => {
		acc[key] = model[key].value;
		return acc;
	}, {});
};

export const getValidationErrors = (state: INewItemFields, model: NewItemModelType) => {
	return Object.keys(model).reduce((errors: NewItemErrorsType, key: string) => {
		const validationMsg = model[key].validators.reduce((acc: string[], errorMessageFn) => {
			const getErrorMsg = errorMessageFn(state[key], state);
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
