import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';

import { Toast } from 'components/toast';
import { UserMenu } from 'components/userMenu';
import { LanguageSelector } from 'components/languageSelector';
import { Drawer } from 'components/drawer';
import { LoginButton } from 'components/loginButton';
import { ConnectedIntlProvider } from 'components/connectedIntlProvider';
import { KeepMeLoggedModal } from 'components/modals/keepMeLoggedModal';
import { ClientTopMenu as TopMenu } from 'components/menu/clientTopMenu';
import { clientRoutes } from 'client-utils/routes';
import { removeInjectedStyles } from 'client-utils/methods';
import { getInitialData, IGetInitialDataParams } from 'actions/initialData';
import { getStaticFileUri, Languages } from 'global-utils';

import { CityPage } from 'pages/client/city';
import { ItemPage } from 'pages/client/item';
import { LoginPage } from 'pages/client/login';
import { HomePage } from 'pages/client/home';

import { IAppState } from 'types';

import { getEnabledCities, isLoggedIn, getClientLocale } from 'selectors';

// @ts-ignore
import logoUrl from 'static/images/logo.gif';

import { styles } from './styles';

interface IMatchParams {
  cityName: string;
  locale: Languages;
}

interface ILayoutPageParams extends RouteComponentProps<IMatchParams>, WithStyles<typeof styles> {
  isLoggedIn: boolean;
  getInitialData: (params?: IGetInitialDataParams) => void;
  locale: Languages;
}

export const loadInitialData = (store, params: IMatchParams) => store.dispatch(getInitialData({ locale: params.locale }));

class ClientLayoutPage extends React.Component<ILayoutPageParams, any> {
  state = {
    mobileDrawerOpen: false
  };

  componentDidMount() {
    removeInjectedStyles();
  }

  handleDrawerClose = () => {
    this.setState({ mobileDrawerOpen: false });
  }

  handleDrawerToggle = () => {
    this.setState({ mobileDrawerOpen: !this.state.mobileDrawerOpen });
  }

  handleLogoClick = () => {
    this.props.history.push(clientRoutes.landing.getLink(this.props.locale));
  }

  renderLogo = () => {
    return (
      <div onClick={this.handleLogoClick} className={this.props.classes.logo}>
        <img src={getStaticFileUri(logoUrl)} />
      </div>
    );
  }

  render() {
    const { classes, isLoggedIn, locale } = this.props;
    return (
      <ConnectedIntlProvider locale={locale}>
        <div className={classes.wrapper}>
          <Hidden mdUp>
            <Drawer
              onClose={this.handleDrawerClose}
              mobileDrawerOpen={this.state.mobileDrawerOpen}
            >
              <TopMenu
                onRouteChange={this.handleDrawerClose}
                isVertical={true}
                isLoggedIn={isLoggedIn}
              />
            </Drawer>
          </Hidden>
          <AppBar classes={{ colorDefault: classes.appBar }} color="default" position="static">
            <Container maxWidth="xl">
              <Toolbar disableGutters className={classes.toolbar}>
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
                <div className={classes.topMenu}>
                  <Hidden smDown implementation="css">
                    <TopMenu isLoggedIn={isLoggedIn} />
                  </Hidden>
                </div>
                <LoginButton />
                <UserMenu isLoggedIn={isLoggedIn} />
                <LanguageSelector isAdmin={false} locale={this.props.locale} />
              </Toolbar>
            </Container>
          </AppBar>
          <Container maxWidth="xl">
            <Switch>
              <Route path={clientRoutes.login.path} component={LoginPage} />
              <Route exact path={clientRoutes.items.path} component={CityPage} />
              <Route exact path={clientRoutes.item.path} component={ItemPage} />
              <Route path={clientRoutes.landing.path} component={HomePage} />
            </Switch>
          </Container>
          <Toast />
          {this.props.isLoggedIn && <KeepMeLoggedModal />}
        </div>
      </ConnectedIntlProvider>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  isLoggedIn: isLoggedIn(state),
  cities: getEnabledCities(state),
  locale: getClientLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  getInitialData: (params: IGetInitialDataParams) => dispatch(getInitialData(params))
});

export default withStyles(styles)(
  connect<any, any, {}>(mapStateToProps, mapDispatchToProps)(ClientLayoutPage)
);
