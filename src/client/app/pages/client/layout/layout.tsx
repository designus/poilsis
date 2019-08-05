import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Link, RouteComponentProps } from 'react-router-dom';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';

import { Toast } from 'components/toast';
import { UserMenu } from 'components/userMenu';
import { LanguageSelector } from 'components/languageSelector';
import { Loader } from 'components/loader';
import { Drawer } from 'components/drawer';
import { ClientTopMenu as TopMenu } from 'components/menu/clientTopMenu';
import { clientRoutes } from 'client-utils/routes';
import { removeInjectedStyles } from 'client-utils/methods';
import { getInitialData, IGetInitialDataParams } from 'actions/initialData';
import { login, logout } from 'actions/auth';
import { getStaticFileUri } from 'global-utils';

import { CityPage } from 'pages/client/city';
import { ItemPage } from 'pages/client/item';
import { LoginPage } from 'pages/client/login';

import { IAppState } from 'reducers';

import { hasInitialDataLoaded, isInitialDataLoading, getCities, isLoggedIn } from 'selectors';


// @ts-ignore
import logoUrl from 'static/images/logo.gif';

import { styles } from './styles';

interface IMatchParams {
  cityName: string;
  locale: string;
}

interface ILayoutPageParams extends RouteComponentProps<IMatchParams>, WithStyles<typeof styles> {
  hasInitialDataLoaded: boolean;
  isInitialDataLoading: boolean;
  isLoggedIn: boolean;
  getInitialData: (params?: IGetInitialDataParams) => void;
  login: (credentials: any) => any;
  locale: string;
}

export const loadInitialData = (store, params: IMatchParams) => store.dispatch(getInitialData({ locale: params.locale }));

class ClientLayoutPage extends React.Component<ILayoutPageParams, any> {
  state = {
    mobileDrawerOpen: false
  };

  componentDidMount() {
    if (!this.props.hasInitialDataLoaded) {
      removeInjectedStyles();
      this.props.getInitialData({ locale: this.props.match.params.locale });
    }
  }

  handleDrawerClose = () => {
    this.setState({ mobileDrawerOpen: false });
  }

  handleDrawerToggle = () => {
    this.setState({ mobileDrawerOpen: !this.state.mobileDrawerOpen });
  }

  renderLogo = () => {
    return (
      <div className={this.props.classes.logo}>
        <img src={getStaticFileUri(logoUrl)} />
      </div>
    );
  }

  render() {
    const { classes, isLoggedIn, login } = this.props;
    return (
      <div className={classes.wrapper}>
        <Hidden mdUp>
          <Drawer
            onClose={this.handleDrawerClose}
            mobileDrawerOpen={this.state.mobileDrawerOpen}
          >
            <TopMenu isVertical={true} isLoggedIn={isLoggedIn} login={login} />
          </Drawer>
        </Hidden>
        <AppBar color="default" position="static">
          <Toolbar className={classes.toolbar}>
            <Hidden mdUp implementation="css">
              <IconButton
                color="inherit"
                aria-label="Open Drawer"
                onClick={this.handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            {this.renderLogo()}
            <Hidden smDown>
              <TopMenu isLoggedIn={isLoggedIn} login={login} />
            </Hidden>
            <UserMenu isLoggedIn={isLoggedIn} />
            <LanguageSelector reloadPageOnChange />
          </Toolbar>
        </AppBar>
        <div className="content">
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
  hasInitialDataLoaded: hasInitialDataLoaded(state),
  isInitialDataLoading: isInitialDataLoading(state),
  isLoggedIn: isLoggedIn(state),
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
