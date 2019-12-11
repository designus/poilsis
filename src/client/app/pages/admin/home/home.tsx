import * as React from 'react';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { IAppState } from 'types';
import { UserRoles } from 'global-utils/typings';
import { AdminHeader } from 'components/adminHeader';
import { getCurrentUserRole } from 'selectors';

interface IOwnProps extends InjectedIntlProps, RouteComponentProps<any> {}

interface IStateProps {
  userRole: UserRoles;
}

type Props = IOwnProps & IStateProps;

const AdminHomePage: React.FunctionComponent<Props> = (props) => {
  return (
    <React.Fragment>
      <AdminHeader
        translationId="admin.menu.dashboard"
        showActions={false}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  userRole: getCurrentUserRole(state)
});

export default injectIntl(
  connect<IStateProps, {}, IOwnProps, IAppState>(mapStateToProps)(AdminHomePage)
);
