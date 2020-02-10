import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { UserRoles } from 'global-utils/typings';
import { ThunkReturn } from 'types';
import { addMockedDataAsync, removeMockedDataAsync } from 'actions';

export interface IOwnProps extends InjectedIntlProps, RouteComponentProps<any> {}

export interface IStateProps {
  userRole?: UserRoles;
}

export interface IDispatchProps {
  addMockedData: ThunkReturn<typeof addMockedDataAsync>;
  removeMockedData: ThunkReturn<typeof removeMockedDataAsync>;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
