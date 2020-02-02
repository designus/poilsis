import * as React from 'react';
import { Route } from 'react-router-dom';
import { renderMergedProps } from 'client-utils/methods';

export const PropsRoute = ({ component, ...rest }: any) => {
  return (
    // tslint:disable-next-line
    <Route {...rest} render={routeProps => renderMergedProps(component, routeProps, rest)} />
  );
};
