import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'components/button';
import { injectIntl, FormattedMessage } from 'react-intl';
import { IAppState } from 'types';
import { AdminHeader } from 'components/adminHeader';
import { getCurrentUserRole } from 'selectors';
import { addTestDataAsync, removeTestDataAsync } from 'actions';

import { Props, IStateProps, IDispatchProps, IOwnProps } from './types';
import { UserRoles } from 'global-utils';

const AdminHomePage: React.FunctionComponent<Props> = (props) => {
  const renderTestDataButtons = () => (
    <React.Fragment>
      <Button onClick={props.addTestData} type="button" variant="contained" color="primary">
        <FormattedMessage id="admin.home.add_test_data" />
      </Button>
      <Button onClick={props.removeTestData} type="button" variant="contained" color="primary">
        <FormattedMessage id="admin.home.remove_test_data" />
      </Button>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <AdminHeader
        translationId="admin.menu.dashboard"
        showActions={false}
      />
      {props.userRole === UserRoles.admin && renderTestDataButtons()}
    </React.Fragment>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  userRole: getCurrentUserRole(state)
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
  addTestData: () => dispatch(addTestDataAsync()),
  removeTestData: () => dispatch(removeTestDataAsync())
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(AdminHomePage)
);
