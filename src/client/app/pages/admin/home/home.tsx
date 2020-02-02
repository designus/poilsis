import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'components/button';
import { injectIntl, FormattedMessage } from 'react-intl';
import { IAppState, ThunkDispatch } from 'types';
import { AdminHeader } from 'components/adminHeader';
import { getCurrentUserRole } from 'selectors';
import { addMockedDataAsync, removeMockedDataAsync } from 'actions';

import { Props, IStateProps, IDispatchProps, IOwnProps } from './types';
import { UserRoles } from 'global-utils';

const AdminHomePage: React.FunctionComponent<Props> = (props) => {
  const renderMockedDataControls = () => (
    <React.Fragment>
      <Button onClick={props.addMockedData} type="button" variant="contained" color="primary">
        <FormattedMessage id="admin.home.add_test_data" />
      </Button>
      <Button onClick={props.removeMockedData} type="button" variant="contained" color="primary">
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
      {props.userRole === UserRoles.admin && renderMockedDataControls()}
    </React.Fragment>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  userRole: getCurrentUserRole(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  addMockedData: () => dispatch(addMockedDataAsync()),
  removeMockedData: () => dispatch(removeMockedDataAsync())
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(AdminHomePage)
);
