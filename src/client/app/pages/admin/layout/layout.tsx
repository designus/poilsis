import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
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
import { Switch, RouteComponentProps } from 'react-router-dom';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { adminRoutes, clientRoutes } from 'client-utils/routes';
import { removeInjectedStyles } from 'client-utils/methods';
import { IAppState } from 'types';
import { getInitialData, IGetInitialDataParams } from 'actions/initialData';

import { Toast } from 'components/toast';
import { IMenuItem } from 'components/menu';
import { Drawer } from 'components/drawer';
import { UserMenu } from 'components/userMenu';
import { NotFound } from 'components/notFound';
import { NotAuthorized } from 'components/notAuthorized';
import { ProtectedRoute } from 'components/protectedRoute';
import { LanguageSelector } from 'components/languageSelector';
import { AdminLeftMenu as LeftMenu } from 'components/menu/adminLeftMenu';
import { Loader } from 'components/loader';

import { AdminItemsPage } from 'pages/admin/items';
import { CreateEditItemPage } from 'pages/admin/createEditItem';
import { CreateEditTypePage } from 'pages/admin/createEditType';
import { CreateEditCityPage } from 'pages/admin/createEditCity';
import { AdminTypesPage } from 'pages/admin/types';
import { AdminCitiesPage } from 'pages/admin/cities';

import { hasInitialDataLoaded, shouldLoadInitialData, isInitialDataLoading } from 'selectors';

import { styles } from './styles';

interface IAdminLayoutProps extends WithStyles<typeof styles>, InjectedIntlProps, RouteComponentProps<object> {
  hasInitialDataLoaded: boolean;
  shouldLoadInitialData: boolean;
  isInitialDataLoading: boolean;
  locale: string;
  getInitialData: (params?: IGetInitialDataParams) => void;
  isLoading: () => boolean;
}

class AdminLayoutPage extends React.PureComponent<IAdminLayoutProps, any> {
  state = {
    mobileDrawerOpen: false,
    menuItems: this.menuItems
  };

  componentDidUpdate(prevProps: IAdminLayoutProps) {
    if (this.props.location !== prevProps.location) {
      this.handleDrawerClose();
    }

    if (this.props.shouldLoadInitialData) {
      this.props.getInitialData({ pathName: this.props.location.pathname });
    }
  }

  componentDidMount() {
    if (this.props.shouldLoadInitialData) {
      removeInjectedStyles();
      this.props.getInitialData({ pathName: this.props.location.pathname });
    }
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
        text: formatMessage({ id: 'admin.menu.items' })
      },
      {
        id: 4,
        icon: () => (<TypesIcon />),
        link: adminRoutes.types.getLink(),
        text: formatMessage({ id: 'admin.menu.types' }),
        allowedRoles: adminRoutes.types.allowedRoles
      },
      {
        id: 5,
        icon: () => (<CitiesIcon />),
        link: adminRoutes.cities.getLink(),
        text: formatMessage({ id: 'admin.menu.cities' }),
        allowedRoles: adminRoutes.cities.allowedRoles
      },
      {
        id: 6,
        icon: () => (<ArrowBackIcon />),
        link: clientRoutes.landing.getLink(this.props.locale),
        text: formatMessage({ id: 'admin.menu.go_to_website' })
      }
    ];
  }

  render() {
    const { classes } = this.props;
    return (
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
                <FormattedMessage id="admin.menu.dashboard" />
              </Typography>
              <UserMenu isInverted isLoggedIn />
              <LanguageSelector />
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
        {this.props.isInitialDataLoading && <Loader isLoading />}
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  hasInitialDataLoaded: hasInitialDataLoaded(state),
  shouldLoadInitialData: shouldLoadInitialData(state),
  isInitialDataLoading: isInitialDataLoading(state),
  locale: state.locale
});

const mapDispatchToProps = dispatch => ({
  getInitialData: (params: IGetInitialDataParams) => dispatch(getInitialData(params))
});

export default withStyles(styles)(
  connect<any, any, IAdminLayoutProps>(mapStateToProps, mapDispatchToProps)(
    injectIntl(AdminLayoutPage)
  )
);
