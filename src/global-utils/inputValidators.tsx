import { InjectedIntl } from 'react-intl';
import {
  DEFAULT_LANGUAGE,
  hasLocalizedFields,
  itemValidation,
  IImage,
  IPhotoFormState,
  TranslatableField
} from 'global-utils';

import * as errors from '../data-strings/validation';
import { IsEnabled } from './typings';

const { images: { maxPhotos, maxPhotoSizeBytes, minPhotoWidth, minPhotoHeight } } = itemValidation;

export interface IFormProps {
  intl?: InjectedIntl;
  images?: IImage[];
  values?: any;
  defaultLanguage?: string;
  languages?: string[];
}

export const requiredWhenEnabled = (fieldValue: TranslatableField, formState, formProps: IFormProps) => {
  const isEnabled = formProps.values.isEnabled as IsEnabled;

  if (!fieldValue || !isEnabled) return undefined;

  const requiredError = formProps.intl.formatMessage({ id: errors.REQUIRED });
  const requiredWhenEnabledError = formProps.intl.formatMessage({ id: errors.REQUIRED_WHEN_ENABLED });

  const err = formProps.languages.reduce((acc, lang) => {
    // default language input field is always required
    if (!fieldValue[lang] && (lang === formProps.defaultLanguage || isEnabled[lang])) {
      acc[lang] = lang === formProps.defaultLanguage ? requiredError : requiredWhenEnabledError;
    }

    return acc;
  }, {});

  return Object.keys(err).length > 0 ? err : undefined;

};

export const isRequired = (fieldValue: string | TranslatableField, formState, formProps: IFormProps) => {
  const errorMessage = formProps.intl.formatMessage({ id: errors.REQUIRED });

  if (fieldValue) {
    if (hasLocalizedFields(fieldValue) && !fieldValue[formProps.defaultLanguage]) {
      return errorMessage;
    }
    return undefined;
  }
  return errorMessage;
};

export const maxTextLength = max => (fieldValue, formState, formProps: IFormProps) => {
  if (fieldValue && fieldValue.length > max) {
    return formProps.intl.formatMessage({ id: errors.MAX_TEXT_LENGTH }, { count: max });
  }

  return undefined;
};

export const minTextLength = min => (fieldValue, formState, formProps: IFormProps) => {
  if (fieldValue && fieldValue.length < min) {
    if (hasLocalizedFields(fieldValue) && !fieldValue[DEFAULT_LANGUAGE]) {
      return undefined;
    }
    return formProps.intl.formatMessage({ id: errors.MIN_TEXT_LENGTH }, { count: min });
  }

  return undefined;
};

export const minCheckedCount = min => (fieldValue, formState, formProps: IFormProps) => {
  if (!fieldValue || fieldValue.length < min) {
    return formProps.intl.formatMessage({ id: errors.MIN_CHECKED_LENGTH }, { count: min });
  }

  return undefined;
};

export const maxCheckedCount = max => (fieldValue, formState, formProps: IFormProps) => {
  if (!fieldValue || fieldValue.length > max) {
    return formProps.intl.formatMessage({ id: errors.MAX_CHECKED_LENGTH }, { count: max });
  }

  return undefined;
};

export const isNumber = (fieldValue, formState, formProps: IFormProps) => {
  if (fieldValue && isNaN(Number(fieldValue))) {
    return formProps.intl.formatMessage({ id: errors.WRONG_NUMBER });
  }

  return undefined;
};

export const isEmail = (fieldValue, formState, formProps: IFormProps) => {
  if (fieldValue && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(fieldValue)) {
    return formProps.intl.formatMessage({ id: errors.WRONG_EMAIL });
  }

  return undefined;
};

export const maxUploadedPhotos = (fieldValue: File[], formState: IPhotoFormState, formProps: IFormProps) => {
  if (fieldValue && (formProps.images.length + formState.files.length) > maxPhotos) {
    return formProps.intl.formatMessage({ id: errors.MAX_PHOTO_COUNT }, { count: maxPhotos });
  }

  return undefined;
};

export const maxUploadedPhotoSize = (fieldValue: File[], formState: IPhotoFormState, formProps: IFormProps) => {

  if (!fieldValue) return;

  const doesAnyFileExceedsMaxPhotoSize = fieldValue.some((file: File) => file.size > maxPhotoSizeBytes);
  if (doesAnyFileExceedsMaxPhotoSize) {
    return formProps.intl.formatMessage({ id: errors.MAX_PHOTO_SIZE }, { count: maxPhotoSizeBytes });
  }
};

export const asyncValidateImage = (state: IPhotoFormState, intl: InjectedIntl): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const { files } = state;
    if (!state.files || !state.files.length) return;
    const dimensions = `(${minPhotoWidth}x${minPhotoHeight}px)`;
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result as string;
        image.onload = (event: any) => {
          const width = event.target.width;
          const height = event.target.height;

          if ((width < height && height < minPhotoHeight) || (width > height && width < minPhotoWidth)) {
            reject({
              files: intl.formatMessage({ id: errors.WRONG_DIMENSIONS }, { dimensions })
            });
          }

          if (index === files.length - 1) {
            resolve();
          }
        };
      };
    });
  });
};
