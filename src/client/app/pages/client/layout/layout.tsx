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
import { ConnectedIntlProvider } from 'components/connectedIntlProvider';
import { KeepMeLoggedModal } from 'components/modals/keepMeLoggedModal';
import { ClientTopMenu as TopMenu } from 'components/menu/clientTopMenu';
import { clientRoutes } from 'client-utils/routes';
import { removeInjectedStyles } from 'client-utils/methods';
import { getInitialData } from 'actions/initialData';
import { getStaticFileUri } from 'global-utils';
import { isLoggedIn, getClientLocale, isInitialDataLoaded } from 'selectors';
import { LoadingBar } from 'components/loadingBar';

import { CityPage } from 'pages/client/city';
import { ItemPage } from 'pages/client/item';
import { LoginPage } from 'pages/client/login';
import { HomePage } from 'pages/client/home';

// @ts-ignore
import logoUrl from 'static/images/logo.gif';

import { IAppState, ThunkDispatch } from 'types';
import { Props, StateProps, OwnProps, DispatchProps } from './types';
import { LoginButton } from './loginButton';

import { styles } from './styles';

const { useState, useEffect } = React;

const ClientLayoutPage: React.FunctionComponent<Props> = (props) => {
  const { isInitialDataLoaded, locale, getInitialData, history, classes, isLoggedIn } = props;
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    removeInjectedStyles();
  }, []);

  useEffect(() => {
    if (!isInitialDataLoaded) {
      getInitialData({ locale });
    }
  }, [isInitialDataLoaded, getInitialData]);

  const handleDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleLogoClick = () => {
    history.push(clientRoutes.landing.getLink(locale));
  };

  const renderLogo = () => {
    return (
      <div onClick={handleLogoClick} className={classes.logo}>
        <img src={getStaticFileUri(logoUrl)} />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        <Hidden mdUp>
          <Drawer
            onClose={handleDrawerClose}
            mobileDrawerOpen={mobileDrawerOpen}
          >
            <TopMenu
              onRouteChange={handleDrawerClose}
              isVertical={true}
              isLoggedIn={isLoggedIn}
            />
          </Drawer>
        </Hidden>
        <AppBar classes={{ colorDefault: classes.appBar }} color="default" position="sticky">
          <LoadingBar />
          <Container maxWidth="xl">
            <Toolbar disableGutters className={classes.toolbar}>
              <Hidden mdUp implementation="css">
                <IconButton
                  color="inherit"
                  aria-label="Open Drawer"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Hidden>
              {renderLogo()}
              <div className={classes.topMenu}>
                <Hidden smDown implementation="css">
                  <TopMenu isLoggedIn={isLoggedIn} />
                </Hidden>
              </div>
              <LoginButton />
              <UserMenu isLoggedIn={isLoggedIn} />
              <LanguageSelector isAdmin={false} locale={locale} />
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth="xl">
          {isInitialDataLoaded ? (
            <Switch>
              <Route path={clientRoutes.login.path} component={LoginPage} />
              <Route exact path={clientRoutes.items.path} component={CityPage} />
              <Route exact path={clientRoutes.item.path} component={ItemPage} />
              <Route exact path={clientRoutes.landing.path} component={HomePage} />
              <Route component={NotFound}/>
            </Switch>
          ) : <Loader isLoading />}
        </Container>
        <Toast />
        {isLoggedIn && <KeepMeLoggedModal />}
      </React.Fragment>
    );
  };

  return (
    <ConnectedIntlProvider locale={locale}>
      <div className={classes.wrapper}>
        {renderContent()}
      </div>
    </ConnectedIntlProvider>
  );
};

const mapStateToProps = (state: IAppState): StateProps => ({
  isLoggedIn: isLoggedIn(state),
  locale: getClientLocale(state),
  isInitialDataLoaded: isInitialDataLoaded(state, false)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  getInitialData: params => dispatch(getInitialData(params))
});

export default withStyles(styles)(
  connect<StateProps, DispatchProps, OwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(ClientLayoutPage)
);
