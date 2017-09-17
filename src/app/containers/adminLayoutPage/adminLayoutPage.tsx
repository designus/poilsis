import * as React from 'react';
import debounceFn from 'lodash-es/debounce';
import { browserHistory } from 'react-router';

import { asyncConnect } from 'redux-connect';
import { initialDataProps } from '../../helpers';
import { Toast, AdminMenu, IAdminMenuItem } from '../../components';
import { withStyles } from 'material-ui/styles';
import {styles} from './styles';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import HomeIcon from 'material-ui-icons/Home';
import ListIcon from 'material-ui-icons/List';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import Input from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

@asyncConnect([initialDataProps])
class AdminLayoutPageComponent extends React.Component<any, any> {

  state = {
    searchInput: '',
    search: '',
  };

  constructor(props) {
    super(props);
    browserHistory.listen(location => {
      if (this.state.search && this.state.searchInput) {
        this.setState({search: '', searchInput: ''});
      }
    });
  }

  searchItems = debounceFn(this.setSearch, 500);

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
            <Toolbar className={classes.toolbar}>
              <div>Admin panel</div>
              <FormControl>
                <Input
                  placeholder="Search"
                  value={this.state.searchInput}
                  disableUnderline={true}
                  onChange={this.onChange}
                  classes={{
                    input: classes.search,
                  }}
                />
              </FormControl>
            </Toolbar>
          </AppBar>
          <Drawer
            type="permanent"
            classes={{
              paper: classes.drawerPaper,
              docked: classes.docked,
            }}
          >
            <div className={classes.drawerHeader}>
              Menu
              <IconButton>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
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
