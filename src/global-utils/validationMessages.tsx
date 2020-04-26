
import IntlMessageFormat from 'intl-messageformat';
import { RANGE, REQUIRED } from 'data-strings';
import { getTranslationMessages } from './methods';
import { DEFAULT_LANGUAGE } from './constants';

export const getValidationMessage = (id: string, value1?: any, value2?: any) => {
  const messages = getTranslationMessages(DEFAULT_LANGUAGE);
  const message = new IntlMessageFormat(messages[id], DEFAULT_LANGUAGE);
  if (id === RANGE) {
    return message.format({ count1: value1, count2: value2 });
  }
  return message.format({ count: value1 });
};

export const getRequiredMessage = () => getValidationMessage(REQUIRED);
