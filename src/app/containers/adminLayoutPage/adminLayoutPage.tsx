import * as React from 'react';
import debounceFn from 'lodash-es/debounce';
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
import Menu from 'material-ui/Menu';
import Hidden from 'material-ui/Hidden';
import { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Typography from 'material-ui/Typography';

import {styles} from './styles';
import { initialDataProps } from '../../helpers';
import { Toast, AdminMenu, IAdminMenuItem, Drawer, SearchBox } from '../../components';

@asyncConnect([initialDataProps])
class AdminLayoutPageComponent extends React.Component<any, any> {

  state = {
    searchInput: '',
    search: '',
    mobileDrawerOpen: false,
    dropdownAnchorEl: null,
    dropdownMenuOpen: false,
  };

  constructor(props) {
    super(props);
    if (browserHistory) {
      browserHistory.listen(this.routeChangeCallback.bind(this));
    }
  }

  searchItems = debounceFn(this.setSearch, 500);

  handleDrawerClose = () => {
    this.setState({ mobileDrawerOpen: false });
  }

  handleDrawerToggle = () => {
    this.setState({ mobileDrawerOpen: !this.state.mobileDrawerOpen });
  }

  handleMenuOpen = event => {
    this.setState({ dropdownMenuOpen: true, dropdownAnchorEl: event.currentTarget });
  }

  handleMenuclose = () => {
    this.setState({ dropdownMenuOpen: false });
  }

  routeChangeCallback() {
    if (this.state.search && this.state.searchInput) {
      this.setState({search: '', searchInput: ''});
    }
  }

  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
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
              <IconButton
                aria-label="More"
                aria-owns="Open right Menu"
                aria-haspopup="true"
                onClick={this.handleMenuOpen}
                className={classes.menuButtonRight}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                id="menuRight"
                anchorEl={this.state.dropdownAnchorEl}
                open={this.state.dropdownMenuOpen}
                onRequestClose={this.handleMenuclose}
              >
                <div>
                  <MenuItem>My account</MenuItem>
                  <MenuItem>Logout</MenuItem>
                </div>
                
              </Menu>
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
