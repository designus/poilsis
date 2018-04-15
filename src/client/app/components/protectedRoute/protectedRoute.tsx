import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { renderMergedProps } from '../../client-utils';
import { IAppState } from '../../reducers';

export interface IProtectedRouteProps {
  component?: React.ComponentClass;
  isAuthenticated?: boolean;
  path?: string;
}

class Protected extends React.Component<IProtectedRouteProps, any> {
  render() {
    const { component, isAuthenticated, ...rest } = this.props;
    return (
      // tslint:disable-next-line
      <Route {...rest} render={routeProps => {
        return isAuthenticated ? (
          renderMergedProps(component, routeProps, rest)
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: { from: routeProps.location },
          }} />
        );
      }} />
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  isAuthenticated: state.auth.isLoggedIn,
});

export const ProtectedRoute = connect<any, any, IProtectedRouteProps>(mapStateToProps)(Protected);
