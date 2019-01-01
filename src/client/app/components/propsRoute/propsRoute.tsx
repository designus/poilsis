import * as React from 'react';
import { Route } from 'react-router-dom';
import { renderMergedProps } from 'client-utils';

export const PropsRoute = ({ component, ...rest }) => {
  return (
    // tslint:disable-next-line
    <Route {...rest} render={routeProps => renderMergedProps(component, routeProps, rest)} />
  );
};
