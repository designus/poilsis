import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Link, RouteComponentProps } from 'react-router-dom';

import { MainMenu, Toast, UserMenu, LanguageSelector, Loader } from 'components';
import { adminRoutes, clientRoutes, removeInjectedStyles } from 'client-utils';
import { getInitialData, login, logout, IGetInitialDataParams } from 'actions';
import { LoginPage, CityPage, ItemPage } from 'pages';
import { IAppState, IItemsMap, ICitiesMap, ITypesMap } from 'reducers';

import { hasInitialDataLoaded, isInitialDataLoading, getCities, isLoggedIn } from 'selectors';

interface IMatchParams {
  cityName: string;
  locale: string;
}

interface ILayoutPageParams extends RouteComponentProps<IMatchParams> {
  hasInitialDataLoaded: boolean;
  isInitialDataLoading: boolean;
  itemsMap: IItemsMap;
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  isAuthenticated: boolean;
  getInitialData: (params?: IGetInitialDataParams) => void;
  login: (credentials: any) => void;
}

export const loadInitialData = (store, params: IMatchParams) => store.dispatch(getInitialData({ locale: params.locale }));

class ClientLayoutPage extends React.Component<ILayoutPageParams, any> {

  componentDidMount() {
    if (!this.props.hasInitialDataLoaded) {
      removeInjectedStyles();
      this.props.getInitialData({ locale: this.props.match.params.locale });
    }
  }

  login = (credentials) => () => {
    this.props.login(credentials);
  }

  render() {
    return (
      <div className="app-container">
        <div className="header">
          This is header
          {this.props.isAuthenticated ?
            <div>
              <UserMenu />
            </div> :
            <div>
              <div onClick={this.login({username: 'admin', password: 'admin'})}>Log in with admin</div>
              <div onClick={this.login({username: 'tomas', password: 'tomas'})}>Log in with user</div>
            </div>
          }
          <LanguageSelector reloadPageOnChange />
        </div>
        <hr />
        <div className="top-menu">
          <Link to={adminRoutes.items.getLink()}>Admin</Link>
        </div>
        <div className="content">
          <MainMenu {...this.props} showSubmenu={false} />
          <Switch>
            <Route path={'/login'} component={LoginPage} />
            <Route exact path={clientRoutes.items.path} component={CityPage} />
            <Route exact path={clientRoutes.item.path} component={ItemPage} />
          </Switch>
        </div>
        <div className="footer">
          This is footer
        </div>
        <Toast />
        {this.props.isInitialDataLoading && <Loader isLoading />}
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  citiesMap: state.cities.dataMap,
  typesMap: state.types.dataMap,
  hasInitialDataLoaded: hasInitialDataLoaded(state),
  isInitialDataLoading: isInitialDataLoading(state),
  isAuthenticated: isLoggedIn(state),
  user: state.currentUser.details && state.currentUser.details.name,
  cities: getCities(state),
  locale: state.locale,
});

const mapDispatchToProps = (dispatch) => ({
  login: (credentials) => dispatch(login(credentials)),
  logout: () => dispatch(logout()),
  getInitialData: (params: IGetInitialDataParams) => dispatch(getInitialData(params)),
});

export default connect<any, any, {}>(mapStateToProps, mapDispatchToProps)(ClientLayoutPage);
