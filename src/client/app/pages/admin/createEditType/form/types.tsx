import { InjectedFormProps } from 'redux-form';
import { RouteComponentProps } from 'react-router-dom';
import { InjectedIntl } from 'react-intl';
import { Languages } from 'global-utils/typings';
import { IMatchParams } from '../types';

export interface ICustomProps extends RouteComponentProps<IMatchParams> {
  intl: InjectedIntl;
  languages: Languages[];
  defaultLanguage: Languages;
  selectedLanguage?: Languages;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
