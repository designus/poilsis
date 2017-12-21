import * as React from 'react';
// import debounceFn from 'lodash-es/debounce';
import { browserHistory } from 'react-router';
import { asyncConnect } from 'redux-connect';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui-icons/Home';
import ListIcon from 'material-ui-icons/List';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import MenuIcon from 'material-ui-icons/Menu';
import Hidden from 'material-ui/Hidden';
import Typography from 'material-ui/Typography';

import {styles} from './styles';
import { initialDataProps, removeInjectedStyles } from '../../../client-utils';
import { Toast, AdminMenu, IAdminMenuItem, Drawer, SearchBox, UserMenu } from '../../../components';

@asyncConnect([initialDataProps])
class AdminLayoutPageComponent extends React.Component<any, any> {

  state = {
    searchInput: '',
    search: '',
    mobileDrawerOpen: false,
  };

  constructor(props) {
    super(props);
    if (browserHistory) {
      browserHistory.listen(this.routeChangeCallback.bind(this));
    }
  }

  // searchItems = debounceFn(this.setSearch, 500);
  searchItems = this.setSearch;

  handleDrawerClose = () => {
    this.setState({ mobileDrawerOpen: false });
  }

  handleDrawerToggle = () => {
    this.setState({ mobileDrawerOpen: !this.state.mobileDrawerOpen });
  }

  routeChangeCallback() {
    if (this.state.search && this.state.searchInput) {
      this.setState({search: '', searchInput: ''});
    }
  }

  componentDidMount() {
    removeInjectedStyles();
  }

  get adminMenuItems(): IAdminMenuItem[] {
    return [
      {
        icon: () => (<HomeIcon />),
        link: '/admin/home',
        text: 'Home',
      },
      {
        icon: () => (<ListIcon />),
        link: '/admin/items',
        text: 'Items',
      },
      {
        icon: () => (<ArrowBackIcon />),
        link: '/',
        text: 'Go to website',
      },
    ];
  }

  onChange = (event) => {
    this.setState({ searchInput: event.target.value });
    this.searchItems();
  }

  setSearch() {
    this.setState({ search: this.state.searchInput });
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
              <SearchBox
                searchInput={this.state.searchInput}
                onChange={this.onChange}
              />
              <UserMenu />
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            onRequestClose={this.handleDrawerClose}
            mobileDrawerOpen={this.state.mobileDrawerOpen}
          >
            <AdminMenu items={this.adminMenuItems} />
          </Drawer>
          <main className={classes.content}>
            {React.cloneElement(this.props.children, { search: this.state.search })}
          </main>
        </div>
        <Toast />
      </div>
    );
  }
};

export const AdminLayoutPage = withStyles(styles)(AdminLayoutPageComponent);
