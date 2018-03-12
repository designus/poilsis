import * as React from 'react';
// import { renderRoutes } from 'react-router-config';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import { adminRoutes, clientRoutes, PropsRoute } from '../client-utils';
import { AdminLayoutPage } from './admin';
import { ClientLayoutPage } from './client';
class AppComponent extends React.Component<any, any> {
  render() {
    return (
      <div>
        {/* {renderRoutes(this.props.route.routes, {state: this.props.state, dispatch: this.props.dispatch})} */}
        <Switch>
          <PropsRoute exact={false} path={adminRoutes.landing.path} component={AdminLayoutPage} />
          <PropsRoute exact={false} path={clientRoutes.landing.path} component={ClientLayoutPage} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({state});
const mapDispatchToProps = (dispatch) => ({dispatch});

export const App = withRouter(connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(AppComponent));
