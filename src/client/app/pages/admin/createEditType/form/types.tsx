import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { Locale, IType } from 'global-utils/typings';

export interface ICustomProps {
  intl: IntlShape;
  languages: Locale[];
  defaultLanguage: Locale;
  selectedLanguage?: Locale;
}

export type Props = ICustomProps & InjectedFormProps<IType, ICustomProps>;
