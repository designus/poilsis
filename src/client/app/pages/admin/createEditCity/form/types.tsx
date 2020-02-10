import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { ITypesMap } from 'types';
import { Locale, ICity } from 'global-utils/typings';

export interface ICustomProps {
  typesMap: ITypesMap;
  locale: Locale;
  intl: IntlShape;
  languages: Locale[];
  defaultLanguage: Locale;
  selectedLanguage?: Locale;
}

export type Props = ICustomProps & InjectedFormProps<ICity, ICustomProps>;
