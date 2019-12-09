import { InjectedFormProps } from 'redux-form';
import { InjectedIntl } from 'react-intl';
import { Languages } from 'global-utils/typings';

export interface ICustomProps {
  intl: InjectedIntl;
  languages: Languages[];
  defaultLanguage: Languages;
  selectedLanguage?: Languages;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
