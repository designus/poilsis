
import IntlMessageFormat from 'intl-messageformat';
import { RANGE, REQUIRED } from 'data-strings';
import { getTranslationMessages, DEFAULT_LANGUAGE } from 'global-utils';

const messages = getTranslationMessages(DEFAULT_LANGUAGE);

export const getValidationMessage = (id: string, value1?, value2?) => {
  const message = new IntlMessageFormat(messages[id], DEFAULT_LANGUAGE);
  if (id === RANGE) {
    return message.format({ count1: value1, count2: value2 });
  }
  return message.format({ count: value1 });
};

export const requiredMessage = getValidationMessage(REQUIRED);
