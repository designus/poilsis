import * as ErrorMessages from './errorMessages';

export const required = (text) => {
	return text ? null : ErrorMessages.isRequired;
};

export const mustMatch = (field, fieldName) => {
	return (text, state) => {
		return state[field] === text ? null : ErrorMessages.mustMatch(fieldName);
	};
};

export const minLength = (length, isSelection = false) => {
	return (item) => {
		if (item.length >= length) {
			return null;
		}
		return isSelection
			? ErrorMessages.minSelectionLength(length)
			: ErrorMessages.minTextLength(length);
	};
};

export const maxLength = (length, isSelection = false) => {
	return (item) => {
		if (item.length <= length) {
			return null;
		}
		return isSelection
			? ErrorMessages.maxSelectionLength(length)
			: ErrorMessages.maxTextLength(length);
	};
};
