import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ListIcon from 'material-ui-icons/List';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import MenuIcon from 'material-ui-icons/Menu';
import Hidden from 'material-ui/Hidden';
import Typography from 'material-ui/Typography';
import { styles } from './styles';
import { removeInjectedStyles, adminRoutes, clientRoutes } from '../../../client-utils';
import { IAppState } from '../../../reducers';
import {
  Toast,
  AdminMenu,
  IAdminMenuItem,
  Drawer,
  UserMenu,
  NotFound,
  PropsRoute,
} from '../../../components';
import { AdminItemsPage, CreateEditItemPage } from '../../../pages';
import { ITEMS, GO_TO_WEBSITE } from '../../../../../data-strings';
import { getInitialData } from '../../../actions';
import { Switch } from 'react-router-dom';

class AdminLayoutPageComponent extends React.Component<any, any> {

  static fetchData(store) {
    return store.dispatch(getInitialData());
  }

  state = {
    mobileDrawerOpen: false,
    menuItems: this.menuItems,
  };

  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.routeChangeCallback();
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

  routeChangeCallback() {
    this.setMenuItems(this.menuItems);
    this.handleDrawerClose();
  }

  get menuItems(): IAdminMenuItem[] {
    return [
      {
        icon: () => (<ListIcon />),
        link: adminRoutes.items.getLink(),
        text: ITEMS,
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
  };

  setMenuItems = (menuItems: IAdminMenuItem[]) => {
    if (this.isDifferentMenuItems(menuItems, this.state.menuItems, 'text')) {
      this.setState({menuItems});
    }
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Hidden lgUp implementation="css">
                <IconButton
                  color="inherit"
                  aria-label="Open Drawer"
                  onClick={this.handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Hidden>
              <Typography className={classes.appBarTitle} type="title" color="inherit" noWrap>
                Admin panel
              </Typography>
              <UserMenu />
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            onClose={this.handleDrawerClose}
            mobileDrawerOpen={this.state.mobileDrawerOpen}
          >
            <AdminMenu items={this.state.menuItems} />
          </Drawer>
          <main className={classes.content}>
            <Switch>
              <PropsRoute
                exact
                path={'/admin/items'}
                component={AdminItemsPage}
                setMenuItems={this.setMenuItems}
              />
              <PropsRoute
                path={'/admin/item/create'}
                component={CreateEditItemPage}
                setMenuItems={this.setMenuItems}
              />
              <PropsRoute
                path={'/admin/item/edit/:id'}
                component={CreateEditItemPage}
                setMenuItems={this.setMenuItems}
              />
              <PropsRoute component={NotFound}/>
            </Switch>
          </main>
        </div>
        <Toast />
      </div>
    );
  }
};

const mapStateToProps = (state: IAppState) => {
  return {
    isInitialDataLoaded: state.initialData.isLoaded,
  };
};

export const AdminLayoutPage = connect(mapStateToProps)(withStyles(styles)(AdminLayoutPageComponent));
