export const isRequired = fieldName => `${fieldName} is required`;

export const minTextLength = length => fieldName => `${fieldName} must be at least ${length} characters`;
export const maxTextLength = length => fieldName => `${fieldName} must be no more than ${length} characters length`;

export const minSelectionLength = length => fieldName => `Please select at least ${length} option for ${fieldName}`;
export const maxSelectionLength = length => fieldName => `Please select no more thant ${length} option for ${fieldName}`;

export const mustMatch = otherFieldName => fieldName => `${fieldName} must match ${otherFieldName}`;

