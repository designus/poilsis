import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { Locale, UserRoles, IItem } from 'global-utils/typings';
import { CitiesMap, ITypesMap, IUsersMap } from 'types';

export interface ICustomProps {
  citiesMap: CitiesMap;
  typesMap: ITypesMap;
  usersMap: IUsersMap;
  userRole?: UserRoles;
  locale: Locale;
  intl: IntlShape;
  languages: Locale[];
  defaultLanguage: Locale;
  selectedLanguage?: Locale;
}

export type Props = ICustomProps & InjectedFormProps<IItem, ICustomProps>;
