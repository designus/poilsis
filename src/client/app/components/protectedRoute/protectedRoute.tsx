import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { renderMergedProps } from '../../client-utils';
import { IAppState } from '../../reducers';
import { NotAuthorized } from '../../components';
import { UserRoles } from '../../../../global-utils';

export interface IProtectedRouteProps {
  component?: React.ComponentClass;
  isAuthenticated?: boolean;
  userRole?: string;
  allowedRoles?: string[];
  path?: string;
}

class Protected extends React.Component<IProtectedRouteProps, any> {

  renderComponent = (routeProps, restProps) => {
    const { component, allowedRoles = [UserRoles.admin, UserRoles.user] } = this.props;
    return allowedRoles.indexOf(this.props.userRole) !== -1 ?
      renderMergedProps(component, routeProps, restProps) :
      <NotAuthorized />;
  }

  redirectToLogin = (routeProps) => {
    return (
      <Redirect to={{
        pathname: '/login',
        state: { from: routeProps.location },
      }} />
    );
  }

  render() {
    const { component, allowedRoles = [UserRoles.admin, UserRoles.user], isAuthenticated, ...rest } = this.props;
    return (
      // tslint:disable-next-line
      <Route {...rest} render={routeProps => {
        return isAuthenticated ? this.renderComponent(routeProps, rest) : this.redirectToLogin(routeProps);
      }} />
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  userRole: state.currentUser.details ? state.currentUser.details.role : null,
  isAuthenticated: state.auth.isLoggedIn,
});

export const ProtectedRoute = connect<any, any, any>(mapStateToProps)(Protected);
