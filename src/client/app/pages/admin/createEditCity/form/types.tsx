import { InjectedFormProps } from 'redux-form';
import { RouteComponentProps } from 'react-router-dom';
import { InjectedIntl } from 'react-intl';
import { ITypesMap } from 'types';
import { Languages } from 'global-utils/typings';
import { IMatchParams } from '../types';

export interface ICustomProps extends RouteComponentProps<IMatchParams> {
  typesMap: ITypesMap;
  locale: Languages;
  intl: InjectedIntl;
  languages: Languages[];
  defaultLanguage: Languages;
  selectedLanguage?: Languages;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
