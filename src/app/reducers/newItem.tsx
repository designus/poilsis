import {ADD_NEW_ITEM_STATE, CLEAR_FIELDS, SHOW_BACKEND_VALIDATION_ERRORS} from '../actions';
import {newItemModel} from '../components/addItemForm';
import {mapValues} from 'lodash';

export const FIELD_VALUES = 'fields';
export const VALIDATION_ERRORS = 'errors';
export const SHOW_VALIDATION_ERRORS = 'showErrors';

export interface INewItemFields {
	address: string;
	city: string;
	description: string;
	name: string;
	types: string[];
}

export type TNewItemErrors<T> = {
	[I in keyof T]?: string[]
};

export interface INewItemState {
	fields: INewItemFields;
	errors: TNewItemErrors<INewItemFields>;
	showErrors: boolean;
}

export const newItemFields: any = mapValues(newItemModel, (item) => item.value);

export const initialNewItemState: INewItemState = {
	fields: newItemFields,
	errors: {},
	showErrors: false,
};

export const newItem = (state: INewItemState = initialNewItemState, action): INewItemState => {
	switch (action.type) {
		case ADD_NEW_ITEM_STATE:
			return action.state;
		case CLEAR_FIELDS:
			return initialNewItemState;
		case SHOW_BACKEND_VALIDATION_ERRORS:
			return {
				...state,
				[VALIDATION_ERRORS]: action.errors,
				[SHOW_VALIDATION_ERRORS]: true,
			};
		default:
			return state;
	}
};
