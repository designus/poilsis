import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { ITypesMap } from 'types';
import { Languages } from 'global-utils/typings';

export interface ICustomProps {
  typesMap: ITypesMap;
  locale: Languages;
  intl: IntlShape;
  languages: Languages[];
  defaultLanguage: Languages;
  selectedLanguage?: Languages;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
