import { newItemModel, NewItemModelType } from '../../components/addItemForm';
import { INewItemFields, NewItemErrorsType } from '../../reducers/newItem';

export const getValidationErrors = (state: INewItemFields, model: NewItemModelType = newItemModel) => {
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
