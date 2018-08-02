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
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { WithStyles } from '@material-ui/core';
import { styles } from './styles';
import { removeInjectedStyles, adminRoutes, clientRoutes } from 'client-utils';
import { IAppState } from 'reducers';
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
import { AdminItemsPage, AdminTypesPage, CreateEditItemPage, CreateEditTypePage } from 'pages';
import { ITEMS, GO_TO_WEBSITE, TYPES } from 'data-strings';
import { getInitialData } from 'actions';
import { Switch } from 'react-router-dom';

interface IAdminLayoutProps extends WithStyles<typeof styles>  {
  isInitialDataLoaded: boolean;
  location: any;
  dispatch: any;
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
      this.props.dispatch(getInitialData());
    }
  }

  handleDrawerClose = () => {
    this.setState({ mobileDrawerOpen: false });
  }

  handleDrawerToggle = () => {
    this.setState({ mobileDrawerOpen: !this.state.mobileDrawerOpen });
  }

  get menuItems(): IAdminMenuItem[] {
    return [
      {
        icon: () => (<DashboardIcon />),
        link: adminRoutes.landing.getLink(),
        text: 'Dashboard',
      },
      {
        icon: () => (<ListIcon />),
        link: adminRoutes.items.getLink(),
        text: ITEMS,
      },
      {
        icon: () => (<TypesIcon />),
        link: adminRoutes.types.getLink(),
        text: TYPES,
        allowedRoles: adminRoutes.types.allowedRoles,
      },
      {
        icon: () => (<ArrowBackIcon />),
        link: clientRoutes.landing.getLink(),
        text: GO_TO_WEBSITE,
      },
    ];
  }

  isDifferentMenuItems(arr1: IAdminMenuItem[], arr2: IAdminMenuItem[], key: keyof IAdminMenuItem) {
    return arr1.length !== arr2.length || arr1.every((item, index) => item[key] !== arr2[index][key]);
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
              <Typography className={classes.appBarTitle} variant="title" color="inherit" noWrap>
                Admin panel
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

const connectedComponent = connect<any, any, IAdminLayoutProps>(mapStateToProps)(AdminLayoutPageComponent);

export const AdminLayoutPage = withStyles(styles)(connectedComponent);
