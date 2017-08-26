import { ADD_NEW_ITEM_STATE, CLEAR_FIELDS, SHOW_BACKEND_VALIDATION_ERRORS } from '../actions';
import { TItemState, itemModel } from '../containers';
import { getInitialFormState } from '../helpers';

export const FIELD_VALUES = 'fields';
export const VALIDATION_ERRORS = 'errors';
export const SHOW_VALIDATION_ERRORS = 'showErrors';

export const newItem = (state: TItemState = getInitialFormState(itemModel), action): TItemState => {
	switch (action.type) {
		case ADD_NEW_ITEM_STATE:
			return action.state;
		case CLEAR_FIELDS:
			return getInitialFormState(itemModel);
		case SHOW_BACKEND_VALIDATION_ERRORS:
			return {
				...state,
				errors: action.errors,
				showErrors: true,
			};
		default:
			return state;
	}
};
