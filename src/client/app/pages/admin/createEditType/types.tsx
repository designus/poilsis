import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { Type } from 'global-utils/data-models';
import { ThunkReturn } from 'types';
import { createType, updateType, getAdminType } from 'actions/types';

export interface IMatchParams {
  typeId: string;
}

export interface IOwnProps extends RouteComponentProps<IMatchParams>, InjectedIntlProps {}

export interface IStateProps {
  loadedType: Type;
  showNavigationPrompt: boolean;
  shouldLoadType: boolean;
}

export interface IDispatchProps {
  getType: ThunkReturn<typeof getAdminType>;
  createType: ThunkReturn<typeof createType>;
  updateType: ThunkReturn<typeof updateType>;
  initializeForm: (type: Type) => void;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
