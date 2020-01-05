import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { Languages } from 'global-utils/typings';

export interface ICustomProps {
  intl: IntlShape;
  languages: Languages[];
  defaultLanguage: Languages;
  selectedLanguage?: Languages;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
