import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'components/button';
import { injectIntl, FormattedMessage } from 'react-intl';
import { IAppState } from 'types';
import { AdminHeader } from 'components/adminHeader';
import { getCurrentUserRole } from 'selectors';
import { addTestData } from 'actions';

import { Props, IStateProps, IDispatchProps, IOwnProps } from './types';
import { UserRoles } from 'global-utils';

const AdminHomePage: React.FunctionComponent<Props> = (props) => {

  const addTestData = (count: number) => () => {
    props.addTestData(count);
  };

  return (
    <React.Fragment>
      <AdminHeader
        translationId="admin.menu.dashboard"
        showActions={false}
      />
      {props.userRole === UserRoles.admin && (
        <Button onClick={addTestData(1000)} type="button" variant="contained" color="primary">
          <FormattedMessage id="admin.home.add_test_data" />
        </Button>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  userRole: getCurrentUserRole(state)
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
  addTestData: count => dispatch(addTestData(count))
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(AdminHomePage)
);
