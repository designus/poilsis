import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, match } from 'react-router-dom';
import { renderMergedProps } from 'client-utils/methods';
import { IAppState } from 'types';
import { isLoggedIn, getCurrentUserRole } from 'selectors';
import { NotAuthorized } from 'components/notAuthorized';
import { UserRoles } from 'global-utils';

interface IMatchParams {
  userId: string;
}

interface IProtectedRouteProps {
  component?: any;
  allowedRoles?: UserRoles[];
  path?: string;
  exact?: boolean;
  strict?: boolean;
  match?: match<IMatchParams>;
}

interface IStateProps {
  isAuthenticated?: boolean;
  userId?: string;
  userRole?: UserRoles;
}

type Props = IProtectedRouteProps & IStateProps;

class ProtectedRoute extends React.Component<Props> {

  isContentNotRestricted = (userRole: UserRoles, allowedRoles: UserRoles[]) => {
    return allowedRoles.indexOf(userRole) !== -1;
  }

  isUserTryingToAccessOwnContent = (userId: string, userRole: UserRoles) => {
    const match = this.props.match;
    if (match && userRole !== UserRoles.admin) {
      return !match.params.userId || match.params.userId === userId;
    }

    return true;
  }

  isUserAllowedToEnter = (allowedRoles: UserRoles[], userRole: UserRoles, userId: string) => {
    return this.isContentNotRestricted(userRole, allowedRoles) &&
      this.isUserTryingToAccessOwnContent(userId, userRole);
  }

  renderComponent = (routeProps: any, restProps: any) => {
    const { component, allowedRoles = [UserRoles.admin, UserRoles.user], userRole, userId } = this.props;
    return this.isUserAllowedToEnter(allowedRoles, userRole, userId) ?
      renderMergedProps(component, routeProps, restProps) :
      <NotAuthorized />;
  }

  redirectToLogin = (routeProps: any) => {
    return (
      <Redirect to={{
        pathname: '/login',
        state: { from: routeProps.location }
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

const mapStateToProps = (state: IAppState): IStateProps => ({
  userRole: getCurrentUserRole(state),
  userId: getCurrentUserRole(state),
  isAuthenticated: isLoggedIn(state)
});

export default connect<IStateProps, {}, IProtectedRouteProps, IAppState>(mapStateToProps)(ProtectedRoute);
