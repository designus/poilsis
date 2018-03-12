'use strict';

import * as React from 'react';
import { Link } from 'react-router-dom';

export class NotFound extends React.Component<any, any> {
  render() {
    console.log('Not found this props', this.props);
    return (
      <div className="not-found">
        <h1>404</h1>
        <h2>Page not found!</h2>
        <p>
          <Link to="/">Go back to the main page</Link>
        </p>
      </div>
    );
  }
}
