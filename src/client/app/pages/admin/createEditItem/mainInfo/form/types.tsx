import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { Item } from 'global-utils/data-models';
import { Locale, UserRoles } from 'global-utils/typings';
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

export type Props = ICustomProps & InjectedFormProps<Item, ICustomProps>;
