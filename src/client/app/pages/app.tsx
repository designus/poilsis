import * as React from 'react';
import { renderRoutes } from 'react-router-config';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class AppComponent extends React.Component<any, any> {
  render() {
    return (
      <div>
        {renderRoutes(this.props.route.routes, {state: this.props.state, dispatch: this.props.dispatch})}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({state});
const mapDispatchToProps = (dispatch) => ({dispatch});

export const App = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(withRouter(AppComponent));
