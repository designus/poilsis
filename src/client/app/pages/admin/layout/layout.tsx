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
import { WithStyles } from '@material-ui/core';
import { Switch } from 'react-router-dom';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { removeInjectedStyles, adminRoutes, clientRoutes } from 'client-utils';
import { IAppState } from 'reducers';
import { getInitialData } from 'actions';
import {
  Toast,
  VerticalMenu,
  IAdminMenuItem,
  Drawer,
  UserMenu,
  NotFound,
  NotAuthorized,
  ProtectedRoute,
} from 'components';

import {
  AdminItemsPage,
  CreateEditItemPage,
  CreateEditTypePage,
  CreateEditCityPage,
  AdminTypesPage,
  AdminCitiesPage,
} from 'pages';

import { styles } from './styles';
interface IAdminLayoutProps extends WithStyles<typeof styles>, InjectedIntlProps  {
  isInitialDataLoaded: boolean;
  location: any;
  getInitialData: () => void;
}

class AdminLayoutPageComponent extends React.PureComponent<IAdminLayoutProps, any> {

  static fetchData(store) {
    return store.dispatch(getInitialData());
  }

  state = {
    mobileDrawerOpen: false,
    menuItems: this.menuItems,
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.handleDrawerClose();
    }
  }

  componentDidMount() {
    if (!this.props.isInitialDataLoaded) {
      removeInjectedStyles();
      this.props.getInitialData();
    }
  }

  handleDrawerClose = () => {
    this.setState({ mobileDrawerOpen: false });
  }

  handleDrawerToggle = () => {
    this.setState({ mobileDrawerOpen: !this.state.mobileDrawerOpen });
  }

  get menuItems(): IAdminMenuItem[] {
    const { formatMessage } = this.props.intl;
    return [
      {
        icon: () => (<DashboardIcon />),
        link: adminRoutes.landing.getLink(),
        text: formatMessage({ id: 'admin.menu.dashboard' }),
      },
      {
        icon: () => (<ListIcon />),
        link: adminRoutes.items.getLink(),
        text: formatMessage({ id: 'admin.menu.items' }),
      },
      {
        icon: () => (<TypesIcon />),
        link: adminRoutes.types.getLink(),
        text: formatMessage({ id: 'admin.menu.types' }),
        allowedRoles: adminRoutes.types.allowedRoles,
      },
      {
        icon: () => (<CitiesIcon />),
        link: adminRoutes.cities.getLink(),
        text: formatMessage({ id: 'admin.menu.cities' }),
        allowedRoles: adminRoutes.cities.allowedRoles,
      },
      {
        icon: () => (<ArrowBackIcon />),
        link: clientRoutes.landing.getLink(),
        text: formatMessage({ id: 'admin.menu.go_to_website' }),
      },
    ];
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.wrapper}>
        <Drawer
          onClose={this.handleDrawerClose}
          mobileDrawerOpen={this.state.mobileDrawerOpen}
        >
          <VerticalMenu items={this.menuItems} />
        </Drawer>
        <div className={classes.content}>
          <AppBar className={classes.appBar}>
            <Toolbar>
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
                <FormattedMessage id="admin.menu.dashboard" />
              </Typography>
              <UserMenu />
            </Toolbar>
          </AppBar>
          <main className={classes.main}>
            <Switch>
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
                path={adminRoutes.createItem.path}
                component={CreateEditItemPage}
              />
              <ProtectedRoute
                path={adminRoutes.editItem.path}
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
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  isInitialDataLoaded: state.initialData.isLoaded,
});

const mapDispatchToProps = dispatch => ({
  getInitialData: () => dispatch(getInitialData()),
});

const connectedComponent = connect<any, any, IAdminLayoutProps>(mapStateToProps, mapDispatchToProps)(
  injectIntl(AdminLayoutPageComponent),
);

export const AdminLayoutPage = withStyles(styles)(connectedComponent);
