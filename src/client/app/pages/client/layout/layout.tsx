import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { MainMenu } from '../../../components';
import { adminRoutes, clientRoutes, removeInjectedStyles } from '../../../client-utils';
import { getInitialData } from '../../../actions';

import { IAppState } from '../../../reducers';

class ClientLayoutPageComponent extends React.Component<any, any> {

  static fetchData(store) {
    return store.dispatch(getInitialData());
  }

  componentDidMount() {
    if (!this.props.isInitialDataLoaded) {
      removeInjectedStyles();
      this.props.dispatch(getInitialData());
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="header">
          This is header
        </div>
        <div className="top-menu">
          <Link to="/pasiskelbti">Pasiskelbkite</Link>&nbsp;
          <Link to={adminRoutes.items.getLink()}>Admin</Link>
        </div>
        <div className="content">
          <MainMenu {...this.props} showSubmenu={false} />
          <Route path={clientRoutes.items.path} component={clientRoutes.items.getComponent()} />
        </div>
        <div className="footer">
          This is footer
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    citiesMap: state.cities.dataMap,
    typesMap: state.types.dataMap,
    isInitialDataLoaded: state.initialData.isLoaded,
  };
};

export const ClientLayoutPage = connect<any, any, {}>(mapStateToProps)(ClientLayoutPageComponent);
