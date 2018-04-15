import * as React from 'react';

export class NotAuthorized extends React.PureComponent<any, any> {
  render() {
    return (
      <div className="not-authorized">
        <h1>401</h1>
        <h2>You are not authorized to view this content</h2>
      </div>
    );
  }
}
