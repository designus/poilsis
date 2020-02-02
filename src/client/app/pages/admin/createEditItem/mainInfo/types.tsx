import { Locale, IItem, UserRoles } from 'global-utils/typings';
import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';

import { updateMainInfo, createItem } from 'actions/items';
import { ICitiesMap, ITypesMap, IUsersMap, ThunkReturn } from 'types';
import { CreateEditItemProps } from '../types';

export interface IOwnProps extends CreateEditItemProps, InjectedIntlProps {
  isCreatePage: boolean;
}

export interface IStateProps {
  usersMap: IUsersMap;
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  userRole: UserRoles;
  locale: Locale;
  showNavigationPrompt: boolean;
}

export interface IDispatchProps {
  createItem: ThunkReturn<typeof createItem>;
  updateItem: ThunkReturn<typeof updateMainInfo>;
  initializeForm: (item: IItem) => void;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
