import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ListIcon from '@material-ui/icons/List';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuIcon from '@material-ui/icons/Menu';
import TypesIcon from '@material-ui/icons/Gesture';
import CitiesIcon from '@material-ui/icons/BeachAccess';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { Switch, withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';

import { adminRoutes, clientRoutes } from 'client-utils/routes';
import { removeInjectedStyles, isAdminItemActive } from 'client-utils/methods';
import { IAppState, ThunkDispatch } from 'types';
import { getInitialData } from 'actions/initialData';

import { Toast } from 'components/toast';
import { IMenuItem } from 'components/menu';
import { Drawer } from 'components/drawer';
import { UserMenu } from 'components/userMenu';
import { NotFound } from 'components/notFound';
import { NotAuthorized } from 'components/notAuthorized';
import { ProtectedRoute } from 'components/protectedRoute';
import { LanguageSelector } from 'components/languageSelector';
import { AdminLeftMenu as LeftMenu } from 'components/menu/adminLeftMenu';
import { KeepMeLoggedModal } from 'components/modals/keepMeLoggedModal';
import { LoadingBar } from 'components/loadingBar';
import { getAdminLocale, getClientLocale } from 'selectors';

import { AdminItemsPage } from 'pages/admin/items';
import { CreateEditItemPage } from 'pages/admin/createEditItem';
import { CreateEditTypePage } from 'pages/admin/createEditType';
import { CreateEditCityPage } from 'pages/admin/createEditCity';
import { AdminTypesPage } from 'pages/admin/types';
import { AdminCitiesPage } from 'pages/admin/cities';
import { AdminHomePage } from 'pages/admin/home';

import { IOwnProps, IStateProps, IDispatchProps, AdminLayoutProps } from './types';

import { styles } from './styles';

class AdminLayoutPage extends React.PureComponent<AdminLayoutProps, any> {
  state = {
    mobileDrawerOpen: false,
    menuItems: this.menuItems
  };

  componentDidUpdate(prevProps: AdminLayoutProps) {
    if (this.props.location !== prevProps.location) {
      this.handleDrawerClose();
    }
  }

  componentDidMount() {
    removeInjectedStyles();
  }

  handleDrawerClose = () => {
    this.setState({ mobileDrawerOpen: false });
  }

  handleDrawerToggle = () => {
    this.setState({ mobileDrawerOpen: !this.state.mobileDrawerOpen });
  }

  get menuItems(): IMenuItem[] {
    const { formatMessage } = this.props.intl;
    return [
      {
        id: 1,
        icon: () => (<DashboardIcon />),
        link: adminRoutes.landing.getLink(),
        text: formatMessage({ id: 'admin.menu.dashboard' })
      },
      {
        id: 3,
        icon: () => (<ListIcon />),
        link: adminRoutes.items.getLink(),
        text: formatMessage({ id: 'admin.menu.items' }),
        isActive: isAdminItemActive(this.props.location.pathname, [
          adminRoutes.items.path,
          adminRoutes.editItem.path,
          adminRoutes.editItemDescription.path,
          adminRoutes.editItemMain.path,
          adminRoutes.editItemPhotos.path
        ])
      },
      {
        id: 4,
        icon: () => (<TypesIcon />),
        link: adminRoutes.types.getLink(),
        text: formatMessage({ id: 'admin.menu.types' }),
        allowedRoles: adminRoutes.types.allowedRoles,
        isActive: isAdminItemActive(this.props.location.pathname, [
          adminRoutes.types.path,
          adminRoutes.createType.path,
          adminRoutes.editType.path
        ])
      },
      {
        id: 5,
        icon: () => (<CitiesIcon />),
        link: adminRoutes.cities.getLink(),
        text: formatMessage({ id: 'admin.menu.cities' }),
        allowedRoles: adminRoutes.cities.allowedRoles,
        isActive: isAdminItemActive(this.props.location.pathname, [
          adminRoutes.cities.path,
          adminRoutes.editCity.path,
          adminRoutes.createCity.path
        ])
      },
      {
        id: 6,
        icon: () => (<ArrowBackIcon />),
        link: clientRoutes.landing.getLink(this.props.clientLocale),
        text: formatMessage({ id: 'admin.menu.go_to_website' })
      }
    ];
  }

  render() {
    const { classes, adminLocale } = this.props;
    return (
      <React.Fragment>
        <LoadingBar isAdmin />
        <div className={classes.wrapper}>
          <Drawer
            onClose={this.handleDrawerClose}
            mobileDrawerOpen={this.state.mobileDrawerOpen}
          >
            <LeftMenu isVertical items={this.menuItems} />
          </Drawer>
          <div className={classes.content}>
            <AppBar className={classes.appBar}>
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
                <Typography className={classes.appBarTitle} variant="h6" color="inherit" noWrap>
                  <div className="editItemName">
                    <FormattedMessage id="admin.menu.dashboard" />
                  </div>
                </Typography>
                <UserMenu isInverted isLoggedIn />
                <LanguageSelector isAdmin={true} locale={adminLocale} />
              </Toolbar>
            </AppBar>
              <main className={classes.main}>
                <Switch>
                  <ProtectedRoute
                    exact
                    path={adminRoutes.landing.path}
                    component={AdminHomePage}
                  />
                  <ProtectedRoute
                    exact
                    path={adminRoutes.items.path}
                    component={AdminItemsPage}
                  />
                  <ProtectedRoute
                    exact
                    path={adminRoutes.types.path}
                    component={AdminTypesPage}
                    allowedRoles={adminRoutes.types.allowedRoles}
                  />
                  <ProtectedRoute
                    exact
                    path={adminRoutes.cities.path}
                    component={AdminCitiesPage}
                    allowedRoles={adminRoutes.cities.allowedRoles}
                  />
                  <ProtectedRoute
                    path={adminRoutes.editItem.path}
                    component={CreateEditItemPage}
                  />
                  <ProtectedRoute
                    path={adminRoutes.createItem.path}
                    component={CreateEditItemPage}
                  />
                  <ProtectedRoute
                    path={adminRoutes.createType.path}
                    component={CreateEditTypePage}
                  />
                  <ProtectedRoute
                    path={adminRoutes.editType.path}
                    component={CreateEditTypePage}
                  />
                  <ProtectedRoute
                    path={adminRoutes.createCity.path}
                    component={CreateEditCityPage}
                  />
                  <ProtectedRoute
                    path={adminRoutes.editCity.path}
                    component={CreateEditCityPage}
                  />
                  <ProtectedRoute
                    path={'/admin/not-authorized'}
                    component={NotAuthorized}
                  />
                  <ProtectedRoute component={NotFound}/>
                </Switch>
              </main>
          </div>
          <Toast />
          <KeepMeLoggedModal />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  adminLocale: getAdminLocale(state),
  clientLocale: getClientLocale(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  getInitialData: params => dispatch(getInitialData(params))
});

export default withStyles(styles)(
  withRouter(
    injectIntl(
      connect<IStateProps, IDispatchProps, IOwnProps>(mapStateToProps, mapDispatchToProps)(
        AdminLayoutPage
      )
    )
  )
);
