import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';

import { Toast } from 'components/toast';
import { UserMenu } from 'components/userMenu';
import { LanguageSelector } from 'components/languageSelector';
import { NotFound } from 'components/notFound';
import { Drawer } from 'components/drawer';
import { Loader } from 'components/loader';
import { LoginButton } from 'components/loginButton';
import { ConnectedIntlProvider } from 'components/connectedIntlProvider';
import { KeepMeLoggedModal } from 'components/modals/keepMeLoggedModal';
import { ClientTopMenu as TopMenu } from 'components/menu/clientTopMenu';
import { clientRoutes } from 'client-utils/routes';
import { removeInjectedStyles } from 'client-utils/methods';
import { getInitialData } from 'actions/initialData';
import { getStaticFileUri } from 'global-utils';
import { getEnabledCities, isLoggedIn, getClientLocale, isInitialDataLoaded } from 'selectors';

import { CityPage } from 'pages/client/city';
import { ItemPage } from 'pages/client/item';
import { LoginPage } from 'pages/client/login';
import { HomePage } from 'pages/client/home';

// @ts-ignore
import logoUrl from 'static/images/logo.gif';

import { IAppState, ThunkDispatch } from 'types';
import { State, Props, StateProps, OwnProps, DispatchProps } from './types';

import { styles } from './styles';

class ClientLayoutPage extends React.Component<Props, State> {
  state = {
    mobileDrawerOpen: false
  };

  componentDidMount() {
    removeInjectedStyles();
  }

  componentDidUpdate() {
    if (!this.props.isInitialDataLoaded) {
      this.props.getInitialData({ locale: this.props.locale });
    }
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

  renderContent = () => {
    const { classes, isLoggedIn, locale } = this.props;
    return (
      <React.Fragment>
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
            <Route exact path={clientRoutes.landing.path} component={HomePage} />
            <Route component={NotFound}/>
          </Switch>
        </Container>
        <Toast />
        {this.props.isLoggedIn && <KeepMeLoggedModal />}
      </React.Fragment>
    );
  }

  render() {
    const { classes, locale, isInitialDataLoaded } = this.props;
    return (
      <ConnectedIntlProvider locale={locale}>
        <div className={classes.wrapper}>
          {isInitialDataLoaded ? this.renderContent() : <Loader isLoading />}
        </div>
      </ConnectedIntlProvider>
    );
  }
}

const mapStateToProps = (state: IAppState): StateProps => ({
  isLoggedIn: isLoggedIn(state),
  locale: getClientLocale(state),
  isInitialDataLoaded: isInitialDataLoaded(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  getInitialData: params => dispatch(getInitialData(params))
});

export default withStyles(styles)(
  connect<StateProps, DispatchProps, OwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(ClientLayoutPage)
);
