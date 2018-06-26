import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
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

  renderItemContent = (item: IAdminMenuItem, index: number) => {
    const { button, icon, text, link } = this.props.classes;
    return (
      <ListItem
        key={index}
        disableGutters
        className={item.isDisabled ? 'disabled' : ''}
        classes={{ root: button }}
      >
        <NavLink to={item.link} className={link} activeClassName="active" exact>
          <ListItemIcon className={icon}>
            {item.icon()}
          </ListItemIcon>
          <ListItemText className={text} inset primary={item.text} />
        </NavLink>
      </ListItem>
    );
  }

  isItemVisible = (item: IAdminMenuItem) => {
    return !item.allowedRoles || item.allowedRoles.indexOf(this.props.userRole) !== -1;
  }

  renderItem = (item: IAdminMenuItem, index) => {
    return this.isItemVisible(item) ?
      this.renderItemContent(item, index) :
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
