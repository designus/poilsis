import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { MainMenu } from '../../../components';
import { adminRoutes, removeInjectedStyles } from '../../../client-utils';
import { getInitialData } from '../../../actions';

import { IAppState } from '../../../reducers';

class ClientLayoutPageComponent extends React.Component<any, any> {

  static fetchData(store) {
    return store.dispatch(getInitialData());
  }

  componentDidMount() {
    if (!this.props.state.initialData.isLoaded) {
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
          {renderRoutes(this.props.route.routes)}
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
  };
};

export const ClientLayoutPage = connect(mapStateToProps)(ClientLayoutPageComponent);
