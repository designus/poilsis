import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { MainMenu, Toast } from '../../../components';
import { adminRoutes, clientRoutes, removeInjectedStyles } from '../../../client-utils';
import { getInitialData, login, logout } from '../../../actions';
import { LoginPage, CityPage } from '../../../pages';
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
          {this.props.isAuthenticated ?
            <div>
              Hello, <strong>{this.props.user}</strong>
              <div onClick={this.props.logout}>Log out</div>
            </div> :
            <div onClick={this.props.login}>Log in</div>
          }
        </div>
        <hr />
        <div className="top-menu">
          <Link to="/pasiskelbti">Pasiskelbkite</Link>&nbsp;
          <Link to={adminRoutes.items.getLink()}>Admin</Link>
        </div>
        <div className="content">
          <MainMenu {...this.props} showSubmenu={false} />
          <Switch>
            <Route path={'/login'} component={LoginPage} />
            <Route path={clientRoutes.items.path} component={CityPage} />
          </Switch>
        </div>
        <div className="footer">
          This is footer
        </div>
        <Toast />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    citiesMap: state.cities.dataMap,
    typesMap: state.types.dataMap,
    isInitialDataLoaded: state.initialData.isLoaded,
    isAuthenticated: state.auth.isLoggedIn,
    user: state.auth.user && state.auth.user.name,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: () => dispatch(login()),
    logout: () => dispatch(logout()),
  };
};

export const ClientLayoutPage = connect<any, any, {}>(mapStateToProps, mapDispatchToProps)(ClientLayoutPageComponent);
