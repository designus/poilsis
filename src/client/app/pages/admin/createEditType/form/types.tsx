import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { Locale } from 'global-utils/typings';
import { Type } from 'data-models';

export interface ICustomProps {
  intl: IntlShape;
  languages: Locale[];
  defaultLanguage: Locale;
  selectedLanguage?: Locale;
}

export type Props = ICustomProps & InjectedFormProps<Type, ICustomProps>;
