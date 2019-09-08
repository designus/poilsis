import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, match } from 'react-router-dom';
import { renderMergedProps } from 'client-utils/methods';
import { IAppState } from 'types';
import { isLoggedIn } from 'selectors';
import { NotAuthorized } from 'components/notAuthorized';
import { UserRoles } from 'global-utils';

interface IMatchParams {
  userId: string;
}

interface IProtectedRouteProps {
  component?: any;
  isAuthenticated?: boolean;
  userId?: string;
  userRole?: string;
  allowedRoles?: string[];
  path?: string;
  exact?: boolean;
  strict?: boolean;
  match?: match<IMatchParams>;
}

// type TProtectedRouteProps = IProtectedRouteProps & RouteComponentProps<IMatchParams>;
type TProtectedRouteProps = IProtectedRouteProps;

class Protected extends React.Component<TProtectedRouteProps, any> {

  isContentNotRestricted = (userRole, allowedRoles) => {
    return allowedRoles.indexOf(userRole) !== -1;
  }

  isUserTryingToAccessOwnContent = (userId, userRole) => {
    const match = this.props.match;
    if (match && userRole !== UserRoles.admin) {
      return !match.params.userId || match.params.userId === userId;
    }

    return true;
  }

  isUserAllowedToEnter = (allowedRoles, userRole, userId) => {
    return this.isContentNotRestricted(userRole, allowedRoles) &&
      this.isUserTryingToAccessOwnContent(userId, userRole);
  }

  renderComponent = (routeProps, restProps) => {
    const { component, allowedRoles = [UserRoles.admin, UserRoles.user], userRole, userId } = this.props;
    return this.isUserAllowedToEnter(allowedRoles, userRole, userId) ?
      renderMergedProps(component, routeProps, restProps) :
      <NotAuthorized />;
  }

  redirectToLogin = (routeProps) => {
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

const mapStateToProps = (state: IAppState) => {
  const { details: currentUser } = state.currentUser;
  return {
    userRole: currentUser ? currentUser.role : null,
    userId: currentUser ? currentUser.id : null,
    isAuthenticated: isLoggedIn(state)
  };
};

export const ProtectedRoute = connect<any, any, IProtectedRouteProps>(mapStateToProps)(Protected);
