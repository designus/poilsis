import * as React from 'react';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { WithStyles } from '@material-ui/core';
import { IAppState } from '../../reducers';
import { styles } from './verticalMenu/styles';

export interface IAdminMenuItem {
  icon?: () => React.ReactElement<any>;
  link: string;
  text: string;
  isDisabled?: boolean;
  allowedRoles?: string[];
}

export interface IAdminMenuProps extends RouteComponentProps<any>, WithStyles<typeof styles> {
  items: IAdminMenuItem[];
  userRole?: string;
}

class AdminMenuComponent extends React.PureComponent<IAdminMenuProps, any> {

  renderItemContent = (item: IAdminMenuItem) => {
    const { icon, text } = this.props.classes;
    return (
      <>
        <ListItemIcon className={icon}>
          {item.icon()}
        </ListItemIcon>
        <ListItemText className={text} inset primary={item.text} />
      </>
    );
  }

  renderLink = (item: IAdminMenuItem) => {
    return (
      <NavLink to={item.link} className={this.props.classes.link} activeClassName="active" exact>
        {this.renderItemContent(item)}
      </NavLink>
    );
  }

  renderSpan = (item: IAdminMenuItem) => {
    return (
      <span className={this.props.classes.span}>
        {this.renderItemContent(item)}
      </span>
    );
  }

  renderListItem = (item: IAdminMenuItem, index: number) => {
    return (
      <ListItem
        key={index}
        disableGutters
        className={item.isDisabled ? 'disabled' : ''}
        classes={{ root: this.props.classes.button }}
      >
        {item.isDisabled ? this.renderSpan(item) : this.renderLink(item)}
      </ListItem>
    );
  }

  isItemVisible = (item: IAdminMenuItem) => {
    return !item.allowedRoles || item.allowedRoles.indexOf(this.props.userRole) !== -1;
  }

  renderItem = (item: IAdminMenuItem, index) => {
    return this.isItemVisible(item) ?
      this.renderListItem(item, index) :
      null;
  }

  render() {
    return (
      <List>
        {
          this.props.items.map(this.renderItem)
        }
      </List>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  userRole: state.currentUser.details.role,
});

const connectedComponent = connect<any, any, IAdminMenuProps>(mapStateToProps)(AdminMenuComponent);

export const AdminMenu = withRouter(connectedComponent);
