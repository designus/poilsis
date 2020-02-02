import * as React from 'react';
import * as day from 'dayjs';
import { withRouter, Switch, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { reauthenticateUser, showKeepMeLoggedModal } from 'actions/auth';
import { PropsRoute } from 'components/propsRoute';
import { ProtectedRoute } from 'components/protectedRoute';
import { KeepMeLoggedModal } from 'components/modals/keepMeLoggedModal';

import { IAppState, ThunkDispatch } from 'types';
import { isLoggedIn, getSessionExpiryTime, isKeepMeeLoggedModalVisible } from 'selectors';

import { ClientLayoutPage } from 'pages/client/layout';
import { AdminLayoutPage } from 'pages/admin/layout';
import { adminRoutes, clientRoutes } from 'client-utils/routes';

interface IOwnProps extends RouteComponentProps<any> {}

interface IStateProps  {
  isLoggedIn: boolean;
  showKeepMeLoggedModal: boolean;
  sessionExpiryTime: number | null;
}

interface IDispatchProps {
  reauthenticateUser: () => void;
}

type Props = IOwnProps & IStateProps & IDispatchProps;

class App extends React.Component<Props> {

  componentDidMount() {
    KeepMeLoggedModal.preload();
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.props.sessionExpiryTime) return;

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
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => ({
  isLoggedIn: isLoggedIn(state),
  sessionExpiryTime: getSessionExpiryTime(state),
  showKeepMeLoggedModal: isKeepMeeLoggedModalVisible(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  reauthenticateUser: () => dispatch(reauthenticateUser())
});

export default withRouter(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(App)
);
