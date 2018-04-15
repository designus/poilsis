import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import { adminRoutes, clientRoutes } from '../client-utils';
import { AdminLayoutPage } from './admin';
import { ClientLayoutPage } from './client';
import { PropsRoute, ProtectedRoute, KeepMeLoggedModal } from '../components';
class AppComponent extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Switch>
          <ProtectedRoute path={adminRoutes.landing.path} component={AdminLayoutPage} />
          <PropsRoute path={clientRoutes.landing.path} component={ClientLayoutPage} />
        </Switch>
        <KeepMeLoggedModal />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({state});
const mapDispatchToProps = (dispatch) => ({dispatch});

export const App = withRouter(connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(AppComponent));
