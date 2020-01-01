import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { UserRoles } from 'global-utils/typings';
import { ThunkReturn } from 'types';
import { addTestDataAsync, removeTestDataAsync } from 'actions';

export interface IOwnProps extends InjectedIntlProps, RouteComponentProps<any> {}

export interface IStateProps {
  userRole: UserRoles;
}

export interface IDispatchProps {
  addTestData: ThunkReturn<typeof addTestDataAsync>;
  removeTestData: ThunkReturn<typeof removeTestDataAsync>;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
