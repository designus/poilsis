import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Link, RouteComponentProps } from 'react-router-dom';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Menu from '@material-ui/core/Menu';

import { MainMenu } from 'components/mainMenu';
import { Toast } from 'components/toast';
import { UserMenu } from 'components/userMenu';
import { LanguageSelector } from 'components/languageSelector';
import { Loader } from 'components/loader';
import { adminRoutes, clientRoutes } from 'client-utils/routes';
import { removeInjectedStyles } from 'client-utils/methods';
import { getInitialData, IGetInitialDataParams } from 'actions/initialData';
import { login, logout } from 'actions/auth';
import { getStaticFileUri } from 'global-utils';

import { CityPage } from 'pages/client/city';
import { ItemPage } from 'pages/client/item';
import { LoginPage } from 'pages/client/login';

import { IAppState, IItemsMap, ICitiesMap, ITypesMap } from 'reducers';

import { hasInitialDataLoaded, isInitialDataLoading, getCities, isLoggedIn } from 'selectors';

// @ts-ignore
import logoUrl from './logo.gif';

import { styles } from './styles';

interface IMatchParams {
  cityName: string;
  locale: string;
}

interface ILayoutPageParams extends RouteComponentProps<IMatchParams>, WithStyles<typeof styles> {
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
  state = {
    dropdownAnchorEl: null,
    dropdownMenuOpen: false
  };

  componentDidMount() {
    if (!this.props.hasInitialDataLoaded) {
      removeInjectedStyles();
      this.props.getInitialData({ locale: this.props.match.params.locale });
    }
  }

  login = (credentials) => () => {
    this.props.login(credentials);
  }

  handleMenuOpen = event => {
    this.setState({ dropdownMenuOpen: true, dropdownAnchorEl: event.currentTarget });
  }

  handleMenuclose = () => {
    this.setState({ dropdownMenuOpen: false });
  }

  renderLogo = () => {
    return (
      <div className={this.props.classes.logo}>
        <img src={getStaticFileUri(logoUrl)} />
      </div>
    );
  }

  renderUserMenu = () => {
    if (this.props.isAuthenticated) {
      return (
        <UserMenu />
      );
    }

    return null;
  }

  renderAdminItem = () => {
    if (this.props.isAuthenticated) {
      return (
        <MenuItem>
          <Link to={adminRoutes.items.getLink()}>Admin</Link>
        </MenuItem>
      );
    }
    return null;
  }

  renderLoginItem = () => {
    if (!this.props.isAuthenticated) {
      return (
        <React.Fragment>
          <MenuItem onClick={this.handleMenuOpen}>
            Login
          </MenuItem>
          <Menu
            id="loginMenu"
            anchorEl={this.state.dropdownAnchorEl}
            open={this.state.dropdownMenuOpen}
            onClose={this.handleMenuclose}
          >
            <MenuItem onClick={this.login({username: 'admin', password: 'admin'})}>Log in with admin</MenuItem>
            <MenuItem onClick={this.login({username: 'tomas', password: 'tomas'})}>Log in with user</MenuItem>
          </Menu>
        </React.Fragment>
      );
    }

    return null;
  }

  renderTopMenu = () => {
    const { classes } = this.props;
    return (
      <MenuList disablePadding dense classes={{ root: classes.topMenu }}>
        <MenuItem>Pradinis</MenuItem>
        {this.renderAdminItem()}
        {this.renderLoginItem()}
      </MenuList>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <AppBar color="default" position="static">
          <Toolbar className={classes.toolbar}>
            {this.renderLogo()}
            {this.renderTopMenu()}
            {this.renderUserMenu()}
            <LanguageSelector reloadPageOnChange />
          </Toolbar>
        </AppBar>
        {/* <div className="header">
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
        </div>
        <hr /> */}
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
  locale: state.locale
});

const mapDispatchToProps = (dispatch) => ({
  login: (credentials) => dispatch(login(credentials)),
  logout: () => dispatch(logout()),
  getInitialData: (params: IGetInitialDataParams) => dispatch(getInitialData(params))
});

export default withStyles(styles)(
  connect<any, any, {}>(mapStateToProps, mapDispatchToProps)(ClientLayoutPage)
);
