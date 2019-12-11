import { Languages, IItem, UserRoles } from 'global-utils/typings';
import { InjectedIntlProps } from 'react-intl';

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
  locale: Languages;
  showNavigationPrompt: boolean;
}

export interface IDispatchProps {
  createItem: ThunkReturn<typeof createItem>;
  updateItem: ThunkReturn<typeof updateMainInfo>;
  initializeForm: (item: IItem) => void;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
