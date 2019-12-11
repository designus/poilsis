import { InjectedFormProps } from 'redux-form';
import { InjectedIntl } from 'react-intl';
import { Languages, UserRoles } from 'global-utils/typings';
import { ICitiesMap, ITypesMap, IUsersMap } from 'types';

export interface ICustomProps {
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  usersMap: IUsersMap;
  userRole: UserRoles;
  locale: Languages;
  intl: InjectedIntl;
  languages: Languages[];
  defaultLanguage: Languages;
  selectedLanguage?: Languages;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
