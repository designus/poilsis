import { createIntl, createIntlCache } from 'react-intl';
import { getTranslationMessages, IsEnabled, TranslatableField } from '../../global-utils';
import * as errors from '../../data-strings/validation';
import { requiredWhenEnabled, isRequired, IFormProps } from '../inputValidators';
import { LANGUAGES } from '../constants';

const locale = 'en';
const cache = createIntlCache();
const messages = getTranslationMessages(locale);
const intl = createIntl({
  locale,
  messages
}, cache);

describe('inputValidators', () => {
  const getFormProps = (isEnabled?: IsEnabled): IFormProps => ({
    intl,
    defaultLanguage: locale,
    languages: LANGUAGES,
    values: {
      isEnabled
    }
  });

  describe('requiredWhenEnabled()', () => {

    const fieldValue = { en: '', lt: '' } as TranslatableField;

    it('should validate all fields if isEnabled field is set', () => {
      const isEnabled = { en: true, lt: true } as IsEnabled;
      const formProps = getFormProps(isEnabled);

      expect(requiredWhenEnabled(fieldValue, null, formProps)).toEqual({
        en: intl.formatMessage({ id: errors.REQUIRED }),
        lt: intl.formatMessage({ id: errors.REQUIRED_WHEN_ENABLED })
      });
    });

    it('should validate default language field even if isEnabled is not set', () => {
      const isEnabled = { en: false, lt: false } as IsEnabled;
      const formProps = getFormProps(isEnabled);

      expect(requiredWhenEnabled(fieldValue, null, formProps)).toEqual({
        en: intl.formatMessage({ id: errors.REQUIRED })
      });
    });

    it('should pass validation if fieldValue is set', () => {
      const isEnabled = { en: true, lt: true } as IsEnabled;
      const formProps = getFormProps(isEnabled);
      const fieldValue = { en: 'Name', lt: 'Pavadinimas'} as TranslatableField;
      expect(requiredWhenEnabled(fieldValue, null, formProps)).not.toBeDefined();
    });
  });

  describe('isRequired()', () => {
    const formProps = getFormProps();

    it('should validate string value', () => {
      expect(isRequired('', null, formProps)).toBe(intl.formatMessage({ id: errors.REQUIRED }));
      expect(isRequired('test', null, formProps)).not.toBeDefined();
    });

    it('it should validate localized value', () => {
      const invalidFieldValue = { en: '',  lt: '' } as TranslatableField;
      const validFieldValue = { en: 'Name', lt: '' } as TranslatableField;

      expect(isRequired(invalidFieldValue, null, formProps)).toBe(intl.formatMessage({ id: errors.REQUIRED }));
      expect(isRequired(validFieldValue, null, formProps)).not.toBeDefined();
    });
  });
});
