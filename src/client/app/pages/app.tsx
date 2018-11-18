import * as React from 'react';
import { withRouter, Switch } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { adminRoutes, clientRoutes } from '../client-utils';
import { AdminLayoutPage } from './admin';
import { ClientLayoutPage } from './client';
import { PropsRoute, ProtectedRoute, KeepMeLoggedModal } from '../components';
class AppComponent extends React.Component<any, any> {

  render() {
    return (
      <>
        <FormattedMessage id="common.send" defaultMessage="send" />
        <Switch>
          <ProtectedRoute path={adminRoutes.landing.path} component={AdminLayoutPage} />
          <PropsRoute path={clientRoutes.landing.path} component={ClientLayoutPage} />
        </Switch>
        <KeepMeLoggedModal />
      </>
    );
  }
}

export const App = withRouter(AppComponent);
