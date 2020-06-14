import { Locale, UserRoles } from 'global-utils/typings';
import { Item } from 'global-utils/data-models';
import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';

import { updateMainInfo, createItem } from 'actions/items';
import { CitiesMap, ITypesMap, IUsersMap, ThunkReturn } from 'types';
import { CreateEditItemProps } from '../types';

export interface IOwnProps extends CreateEditItemProps, InjectedIntlProps {
  isCreatePage: boolean;
}

export interface IStateProps {
  usersMap: IUsersMap;
  citiesMap: CitiesMap;
  typesMap: ITypesMap;
  userRole?: UserRoles;
  locale: Locale;
  showNavigationPrompt: boolean;
}

export interface IDispatchProps {
  createItem: ThunkReturn<typeof createItem>;
  updateItem: ThunkReturn<typeof updateMainInfo>;
  initializeForm: (item: Item) => void;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
