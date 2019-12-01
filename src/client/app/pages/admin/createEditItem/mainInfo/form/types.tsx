import { InjectedFormProps } from 'redux-form';
import { RouteComponentProps } from 'react-router-dom';
import { InjectedIntl } from 'react-intl';
import { Languages } from 'global-utils/typings';
import { ICitiesMap, ITypesMap, IUsersMap } from 'types';
import { ItemPageMatchParams } from '../../types';

export interface ICustomProps extends RouteComponentProps<ItemPageMatchParams> {
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  usersMap: IUsersMap;
  userRole: string;
  locale: Languages;
  intl: InjectedIntl;
  languages: Languages[];
  defaultLanguage: Languages;
  selectedLanguage?: Languages;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
