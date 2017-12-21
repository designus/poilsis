import {
  isRequired,
  mustMatch,
  minSelectionLength,
  minTextLength,
  maxSelectionLength,
  maxTextLength,
} from '../../../global-utils';

export const required = (text) => {
  return text ? null : isRequired;
};

export const valuesMatch = (field, fieldName) => {
  return (text, state) => {
    return state[field] === text ? null : mustMatch(fieldName);
  };
};

export const minLength = (length, isSelection = false) => {
  return (item) => {
    if (item.length >= length) {
      return null;
    }
    return isSelection
      ? minSelectionLength(length)
      : minTextLength(length);
  };
};

export const maxLength = (length, isSelection = false) => {
  return (item) => {
    if (item.length <= length) {
      return null;
    }
    return isSelection
      ? maxSelectionLength(length)
      : maxTextLength(length);
  };
};
