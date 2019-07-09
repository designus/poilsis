import * as React from 'react';
import * as day from 'dayjs';
import { withRouter, Switch, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { reauthenticateUser } from 'actions/auth';
import { PropsRoute } from 'components/propsRoute';
import { ProtectedRoute } from 'components/protectedRoute';
import { KeepMeLoggedModal } from 'components/modals/keepMeLoggedModal';

import { IAppState } from 'reducers/root';
import { isLoggedIn, getSessionExpiryTime } from 'selectors';

import { ClientLayoutPage } from 'pages/client/layout';
import { AdminLayoutPage } from 'pages/admin/layout';
import { adminRoutes, clientRoutes } from 'client-utils/routes';

interface IAppProps extends RouteComponentProps<any> {
  isLoggedIn?: boolean;
  showKeepMeLoggedModal?: boolean;
  sessionExpiryTime?: number;
  reauthenticateUser?: () => void;
}

class App extends React.Component<IAppProps, any> {

  componentDidMount() {
    KeepMeLoggedModal.preload();
  }

  componentDidUpdate(prevProps: IAppProps) {
    const date1 = day(Date.now());
    const date2 = day(this.props.sessionExpiryTime * 1000);
    const isLessThanMinuteLeft = date2.diff(date1, 'second') < 60;

    if (this.props.isLoggedIn && prevProps.location.pathname !== this.props.location.pathname && isLessThanMinuteLeft) {
      this.props.reauthenticateUser();
    }
  }

  render() {
    return (
      <React.Fragment>
        <Switch>
          <ProtectedRoute path={adminRoutes.landing.path} component={AdminLayoutPage} />
          <PropsRoute path={clientRoutes.landing.path} component={ClientLayoutPage} />
        </Switch>
        {this.props.isLoggedIn && <KeepMeLoggedModal />}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  isLoggedIn: isLoggedIn(state),
  sessionExpiryTime: getSessionExpiryTime(state),
  showKeepMeLoggedModal: state.auth.showKeepMeLoggedModal
});

const mapDispatchToProps = dispatch => ({
  reauthenticateUser: () => dispatch(reauthenticateUser())
});

export default withRouter(
  connect<any, any, IAppProps>(mapStateToProps, mapDispatchToProps)(App)
);
