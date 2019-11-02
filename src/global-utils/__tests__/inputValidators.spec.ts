import { IntlProvider } from 'react-intl';
import { getTranslationMessages, IsEnabled, TranslatableField } from '../../global-utils';
import * as errors from '../../data-strings/validation';
import { requiredWhenEnabled, isRequired, IFormProps } from '../inputValidators';
import { LANGUAGES } from '../constants';

const locale = 'en';
const messages = getTranslationMessages(locale);
const intlProvider = new IntlProvider({ locale, messages });
const { intl } = intlProvider.getChildContext();

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

    const fieldValue: TranslatableField = {
      en: '',
      lt: ''
    };

    it('should validate all fields if isEnabled field is set', () => {
      const formProps = getFormProps({ en: true, lt: true });

      expect(requiredWhenEnabled(fieldValue, null, formProps)).toEqual({
        en: intl.formatMessage({ id: errors.REQUIRED }),
        lt: intl.formatMessage({ id: errors.REQUIRED_WHEN_ENABLED })
      });
    });

    it('should validate default language field even if isEnabled is not set', () => {
      const formProps = getFormProps({ en: false, lt: false });

      expect(requiredWhenEnabled(fieldValue, null, formProps)).toEqual({
        en: intl.formatMessage({ id: errors.REQUIRED })
      });
    });

    it('should pass validation if fieldValue is set', () => {
      const formProps = getFormProps({ en: true, lt: true });
      const fieldValue = { en: 'Name', lt: 'Pavadinimas'};
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
      const invalidFieldValue: TranslatableField = {
        en: '',
        lt: ''
      };

      const validFieldValue: TranslatableField = {
        en: 'Name',
        lt: ''
      };

      expect(isRequired(invalidFieldValue, null, formProps)).toBe(intl.formatMessage({ id: errors.REQUIRED }));
      expect(isRequired(validFieldValue, null, formProps)).not.toBeDefined();
    });
  });
});
