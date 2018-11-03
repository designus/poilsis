import { ImageFile } from 'react-dropzone';
import { IPhotoFormState } from 'pages';
import { DEFAULT_LANGUAGE, hasLocalizedFields } from 'global-utils';

import { REQUIRED_MESSAGE } from './errorMessages';
import { MAX_FILE_COUNT, MAX_FILE_SIZE_B, MAX_FILE_SIZE_MB } from './constants';

export const isRequired = value => {
  if (value) {
    if (hasLocalizedFields(value) && !value[DEFAULT_LANGUAGE]) {
      return REQUIRED_MESSAGE;
    }
    return undefined;
  }
  return REQUIRED_MESSAGE;
};

export const maxTextLength = max => value => value && value.length > max ? `Field must be ${max} characters or less` : undefined;
export const minTextLength = min => value => value && value.length < min ? `Field must be ${min} characters or more` : undefined;

export const minCheckedLength = min => value =>
  !value || value.length < min ? `Please select at least ${min} options` :  undefined;
export const maxCheckedLength = max => value =>
  !value || value.length > max ? `Please select no more than ${max} options` : undefined;

export const isNumber = value => value && isNaN(Number(value)) ? 'Field must be a number' : undefined;
export const isEmail = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  'Invalid email address' :
   undefined;

export const maxUploadedPhotos = (value: ImageFile[], formState: IPhotoFormState) => {
  return value && (formState.images.length + formState.files.length) > MAX_FILE_COUNT ?
    `You are not allowed to uploade more than ${MAX_FILE_COUNT} photos` :
    undefined;
};

export const maxUploadedPhotoSize = (value: ImageFile[], formState: IPhotoFormState) => {
  return value.some(file => file.size > MAX_FILE_SIZE_B) ?
    `Some of your selected files exceeds maximum allowed size of ${MAX_FILE_SIZE_MB} mb` :
    undefined;
};
