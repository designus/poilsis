import { InjectedFormProps } from 'redux-form';
import { InjectedIntl } from 'react-intl';
import { ITypesMap } from 'types';
import { Languages } from 'global-utils/typings';

export interface ICustomProps {
  typesMap: ITypesMap;
  locale: Languages;
  intl: InjectedIntl;
  languages: Languages[];
  defaultLanguage: Languages;
  selectedLanguage?: Languages;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
