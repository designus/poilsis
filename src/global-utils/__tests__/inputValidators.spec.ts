import { IntlProvider } from 'react-intl';
import { getTranslationMessages, IsEnabled, TranslatableField } from '../../global-utils';
import * as errors from '../../data-strings/validation';
import { RequiredWhenEnabled } from '../inputValidators';
import { LANGUAGES } from '../constants';

const locale = 'en';
const messages = getTranslationMessages(locale);
const intlProvider = new IntlProvider({ locale, messages });
const { intl } = intlProvider.getChildContext();

describe('inputValidators', () => {
  describe('RequiredWhenEnabled()', () => {

    const getFormProps = (isEnabled: IsEnabled) => ({
      intl,
      defaultLanguage: locale,
      languages: LANGUAGES,
      values: {
        isEnabled
      }
    });

    const fieldValue: TranslatableField = {
      en: '',
      lt: ''
    };

    it('should validate all fields if isEnabled field is set', () => {
      const formProps = getFormProps({ en: true, lt: true });

      expect(RequiredWhenEnabled(fieldValue, null, formProps)).toEqual({
        en: intl.formatMessage({ id: errors.REQUIRED }),
        lt: intl.formatMessage({ id: errors.REQUIRED_WHEN_ENABLED })
      });
    });

    it('should validate default language field even if isEnabled is not set', () => {
      const formProps = getFormProps({ en: false, lt: false });

      expect(RequiredWhenEnabled(fieldValue, null, formProps)).toEqual({
        en: intl.formatMessage({ id: errors.REQUIRED })
      });
    });

    it('should pass validation if fieldValue is set', () => {
      const formProps = getFormProps({ en: true, lt: true });
      const fieldValue = { en: 'Name', lt: 'Pavadinimas'};
      expect(RequiredWhenEnabled(fieldValue, null, formProps)).not.toBeDefined();
    });
  });
});
