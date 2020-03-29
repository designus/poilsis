import { IntlShape, defineMessages } from 'react-intl';
import {
  DEFAULT_LANGUAGE,
  hasLocalizedFields,
  itemValidation,
  IImage,
  IPhotoFormState,
  TranslatableField,
  Locale,
  IntlSetting,
  Price
} from 'global-utils';
import { isNumber } from 'global-utils/methods';

import * as errors from '../data-strings/validation';
import { IsEnabled, TranslatableFields } from './typings';

const messages = defineMessages({
  invalidPrice: {
    id: 'common.form_validation.wrong_price',
    defaultMessage: 'Min price should be lower than Max price'
  }
});

const { images: { maxPhotos, maxPhotoSizeBytes, minPhotoWidth, minPhotoHeight } } = itemValidation;

export interface IFormProps {
  intl: IntlShape;
  images?: IImage[];
  values?: any;
  defaultLanguage: Locale;
  languages: Locale[];
}

export const requiredWhenEnabled = (fieldValue: TranslatableField, formState: any, formProps: IFormProps) => {
  const isEnabled = formProps.values.isEnabled as IsEnabled;

  if (!fieldValue || !isEnabled) return undefined;

  const requiredError = formProps.intl.formatMessage({ id: errors.REQUIRED });
  const requiredWhenEnabledError = formProps.intl.formatMessage({ id: errors.REQUIRED_WHEN_ENABLED });

  const err = formProps.languages.reduce<TranslatableField>((acc, lang) => {
    // default language input field is always required
    if (!fieldValue[lang] && (lang === formProps.defaultLanguage || isEnabled[lang])) {
      acc[lang] = lang === formProps.defaultLanguage ? requiredError : requiredWhenEnabledError;
    }

    return acc;
  }, {} as TranslatableField);

  return Object.keys(err).length > 0 ? err : undefined;

};

export const isRequired = (fieldValue: string | TranslatableField, formState: any, formProps: IFormProps) => {
  const errorMessage = formProps.intl.formatMessage({ id: errors.REQUIRED });

  if (fieldValue) {
    if (hasLocalizedFields(fieldValue) && !(fieldValue as TranslatableField)[formProps.defaultLanguage]) {
      return errorMessage;
    }
    return undefined;
  }
  return errorMessage;
};

export const priceValidator = (price: Price, formState: any, formProps: IFormProps) => {
  if (price && isNumber(price.from) && isNumber(price.to)) {
    return price.from >= price.to
      ? formProps.intl.formatMessage(messages.invalidPrice)
      : undefined;
  }

  return undefined;
};

export const maxTextLength = (max: number) => (fieldValue: string | TranslatableField, formState: any, formProps: IFormProps) => {
  if (!fieldValue) return undefined;

  if (typeof fieldValue === 'string' && fieldValue.length > max) {
    return formProps.intl.formatMessage({ id: errors.MAX_TEXT_LENGTH }, { count: max });
  }
  // TODO: Add case for Translatable field

  return undefined;
};

export const minTextLength = (min: number) => (fieldValue: string | TranslatableField, formState: any, formProps: IFormProps) => {
  if (!fieldValue) return undefined;

  if (typeof fieldValue === 'string' && fieldValue.length < min) {
    return formProps.intl.formatMessage({ id: errors.MIN_TEXT_LENGTH }, { count: min });
  }

  // TODO: Add case for Translatable field

  return undefined;
};

export const minCheckedCount = (min: number) => (fieldValue: any[], formState: any, formProps: IFormProps) => {
  if (!fieldValue || fieldValue.length < min) {
    return formProps.intl.formatMessage({ id: errors.MIN_CHECKED_LENGTH }, { count: min });
  }

  return undefined;
};

export const maxCheckedCount = (max: number) => (fieldValue: any[], formState: any, formProps: IFormProps) => {
  if (!fieldValue || fieldValue.length > max) {
    return formProps.intl.formatMessage({ id: errors.MAX_CHECKED_LENGTH }, { count: max });
  }

  return undefined;
};

export const isNumberValidator = (fieldValue: any, formState: any, formProps: IFormProps) => {
  if (fieldValue && isNaN(Number(fieldValue))) {
    return formProps.intl.formatMessage({ id: errors.WRONG_NUMBER });
  }

  return undefined;
};

export const isEmail = (fieldValue: string, formState: any, formProps: IFormProps) => {
  if (fieldValue && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(fieldValue)) {
    return formProps.intl.formatMessage({ id: errors.WRONG_EMAIL });
  }

  return undefined;
};

export const maxUploadedPhotos = (fieldValue: File[], formState: IPhotoFormState, formProps: IFormProps) => {
  if (!formProps.images || !formState.files) return undefined;

  if (fieldValue && (formProps.images.length + formState.files.length) > maxPhotos) {
    return formProps.intl.formatMessage({ id: errors.MAX_PHOTO_COUNT }, { count: maxPhotos });
  }

  return undefined;
};

export const maxUploadedPhotoSize = (fieldValue: File[], formState: IPhotoFormState, formProps: IFormProps) => {

  if (!fieldValue) return undefined;

  const doesAnyFileExceedsMaxPhotoSize = fieldValue.some((file: File) => file.size > maxPhotoSizeBytes);

  if (doesAnyFileExceedsMaxPhotoSize) {
    return formProps.intl.formatMessage({ id: errors.MAX_PHOTO_SIZE }, { count: maxPhotoSizeBytes });
  }

  return undefined;
};

export const asyncValidateImage = (state: IPhotoFormState, intl: IntlShape): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const { files } = state;
    if (!files || !files.length) return;
    const dimensions = `(${minPhotoWidth}x${minPhotoHeight}px)`;
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
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
