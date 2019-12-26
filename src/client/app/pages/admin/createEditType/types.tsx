import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { IType } from 'global-utils/typings';
import { ThunkReturn } from 'types';
import { getAdminType } from 'actions/admin';
import { createType, updateType } from 'actions/types';

export interface IMatchParams {
  typeId: string;
}

export interface IOwnProps extends RouteComponentProps<IMatchParams>, InjectedIntlProps {}

export interface IStateProps {
  loadedType: IType;
  showNavigationPrompt: boolean;
  shouldLoadType: boolean;
}

export interface IDispatchProps {
  getType: ThunkReturn<typeof getAdminType>;
  createType: ThunkReturn<typeof createType>;
  updateType: ThunkReturn<typeof updateType>;
  initializeForm: (type: IType) => void;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
