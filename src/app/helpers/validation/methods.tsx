import { newItemModel } from '../../components/addItemForm';

export const getValidationErrors = (state, model = newItemModel) => {
	return Object.keys(model).reduce((errors, key) => {
		const keyModel = model[key];
		const validationMsg = keyModel.validators.reduce((acc, errorMessageFn) => {
			const getErrorMsg = errorMessageFn(state[key], state);
			return getErrorMsg
				? [...acc, getErrorMsg(keyModel.title)]
				: [...acc];
		}, []);

		return {...errors, [key]: validationMsg};

	}, {});
};
