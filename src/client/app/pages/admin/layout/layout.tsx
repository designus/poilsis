import * as React from 'react';
import { browserHistory } from 'react-router';
import { asyncConnect } from 'redux-connect';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ListIcon from 'material-ui-icons/List';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import MenuIcon from 'material-ui-icons/Menu';
import Hidden from 'material-ui/Hidden';
import Typography from 'material-ui/Typography';

import { styles } from './styles';
import { initialDataProps, removeInjectedStyles, adminRoutes } from '../../../client-utils';
import {
  Toast,
  AdminMenu,
  IAdminMenuItem,
  Drawer,
  UserMenu,
} from '../../../components';
import { ITEMS, GO_TO_WEBSITE } from '../../../../../data-strings';

@asyncConnect([initialDataProps])
class AdminLayoutPageComponent extends React.Component<any, any> {

  state = {
    mobileDrawerOpen: false,
    menuItems: this.menuItems,
  };

  constructor(props) {
    super(props);
    if (browserHistory) {
      browserHistory.listen(this.routeChangeCallback.bind(this));
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

  componentDidMount() {
    removeInjectedStyles();
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
        link: '/',
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
                  color="contrast"
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
            onRequestClose={this.handleDrawerClose}
            mobileDrawerOpen={this.state.mobileDrawerOpen}
          >
            <AdminMenu items={this.state.menuItems} />
          </Drawer>
          <main className={classes.content}>
            {React.cloneElement(this.props.children, {
              setMenuItems: this.setMenuItems,
            })}
          </main>
        </div>
        <Toast />
      </div>
    );
  }
};

export const AdminLayoutPage = withStyles(styles)(AdminLayoutPageComponent);
