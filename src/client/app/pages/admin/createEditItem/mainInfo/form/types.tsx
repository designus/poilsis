import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { Item } from 'global-utils/data-models';
import { MainInfoInput } from 'global-utils/input-types';
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
  itemId?: string;
  defaultLanguage: Locale;
  selectedLanguage?: Locale;
}

export type Props = ICustomProps & InjectedFormProps<MainInfoInput, ICustomProps>;
