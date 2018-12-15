import { ImageFile } from 'react-dropzone';
import { FormattedMessage, MessageValue } from 'react-intl';
import { IPhotoFormState } from 'pages';
import {
  DEFAULT_LANGUAGE,
  hasLocalizedFields,
  itemValidation,
} from 'global-utils';

import * as errors from '../data-strings/validation';

const { images: { maxPhotos, maxPhotoSizeBytes } } = itemValidation;

export interface IFormProps {
  formatMessage?: (messages: FormattedMessage.MessageDescriptor, values?: {[key: string]: MessageValue}) => string;
}

export const isRequired = (fieldValue, formState, formProps: IFormProps) => {
  const errorMessage = formProps.formatMessage({ id: errors.REQUIRED });

  if (fieldValue) {
    if (hasLocalizedFields(fieldValue) && !fieldValue[DEFAULT_LANGUAGE]) {
      return errorMessage;
    }
    return undefined;
  }
  return errorMessage;
};

export const maxTextLength = max => (fieldValue, formState, formProps: IFormProps) => {
  if (fieldValue && fieldValue.length > max) {
    return formProps.formatMessage({ id: errors.MAX_TEXT_LENGTH }, { count: max });
  }

  return undefined;
};

export const minTextLength = min => (fieldValue, formState, formProps: IFormProps) => {
  if (fieldValue && fieldValue.length < min) {
    if (hasLocalizedFields(fieldValue) && !fieldValue[DEFAULT_LANGUAGE]) {
      return undefined;
    }
    return formProps.formatMessage({ id: errors.MIN_TEXT_LENGTH }, { count: min });
  }

  return undefined;
};

export const minCheckedCount = min => (fieldValue, formState, formProps: IFormProps) => {
  if (!fieldValue || fieldValue.length < min) {
    return formProps.formatMessage({ id: errors.MIN_CHECKED_LENGTH }, { count: min });
  }

  return undefined;
};

export const maxCheckedCount = max => (fieldValue, formState, formProps: IFormProps) => {
  if (!fieldValue || fieldValue.length > max) {
    return formProps.formatMessage({ id: errors.MAX_CHECKED_LENGTH }, { count: max });
  }

  return undefined;
};

export const isNumber = (fieldValue, formState, formProps: IFormProps) => {
  if (fieldValue && isNaN(Number(fieldValue))) {
    return formProps.formatMessage({ id: errors.WRONG_NUMBER });
  }

  return undefined;
};

export const isEmail = (fieldValue, formState, formProps: IFormProps) => {
  if (fieldValue && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(fieldValue)) {
    return formProps.formatMessage({ id: errors.WRONG_EMAIL });
  }

  return undefined;
};

export const maxUploadedPhotos = (fieldValue: ImageFile[], formState: IPhotoFormState, formProps: IFormProps) => {
  if (fieldValue && (formState.images.length + formState.files.length) > maxPhotos) {
    return formProps.formatMessage({ id: errors.MAX_PHOTO_COUNT }, { count: maxPhotos });
  }

  return undefined;
};

export const maxUploadedPhotoSize = (fieldValue: ImageFile[], formState: IPhotoFormState, formProps: IFormProps) => {
  if (fieldValue.some((file: ImageFile) => file.size > maxPhotoSizeBytes)) {
    return formProps.formatMessage({ id: errors.MAX_PHOTO_SIZE }, { count: maxPhotoSizeBytes });
  }

  return undefined;
};
