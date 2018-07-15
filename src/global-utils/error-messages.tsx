export const maxFileCount = (count) => (fieldName) => `${fieldName} exceeds maximum allowed number of ${count} files`;
export const maxFileSize = (size) => (fieldName) => `${fieldName} exceeds allowed size of ${size} mb`;
export const wrongFileType = (types) => (fieldName) => `${fieldName} supports only ${types}`;

export const REQUIRED_MESSAGE = 'This field is required';
export const getMaxFileCountError = (max) => `You are only allowed to upload up to ${max} files`;
