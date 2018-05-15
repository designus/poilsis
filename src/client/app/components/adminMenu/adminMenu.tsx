import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { IAppState } from '../../reducers';
import { connect } from 'react-redux';

export const StyledListItem = styled(ListItem)`
  padding: 0!important;

  a {
    display: flex;
    padding: 8px 12px;
    flex: 1;
    text-decoration: none;
  }

  &.disabled {
    pointer-events: none;
    opacity: .5;
  }
  
  > a.active h3 {
    color: red;
    text-decoration: none;
  }
` as any;

export interface IAdminMenuItem {
  icon?: () => React.ReactElement<any>;
  link: string;
  text: string;
  isDisabled?: boolean;
  allowedRoles?: string[];
}

export interface IAdminMenuProps {
  items: IAdminMenuItem[];
  userRole?: string;
}

class AdminMenuComponent extends React.PureComponent<IAdminMenuProps, any> {

  renderItem = (item: IAdminMenuItem, index: number) => {
    return (
      <StyledListItem button
        key={index}
        divider={true}
        disableGutters={true}
        className={item.isDisabled ? 'disabled' : ''}
      >
        <NavLink to={item.link} exact={true} activeClassName="active">
          <ListItemIcon>
            {item.icon()}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </NavLink>
      </StyledListItem>
    );
  }

  shouldItemBeVisible = (item: IAdminMenuItem) => {
    return !item.allowedRoles || item.allowedRoles.indexOf(this.props.userRole) !== -1;
  }

  render() {
    return (
      <List>
        {
          this.props.items.map((item: IAdminMenuItem, index) => {
            return this.shouldItemBeVisible(item) ?
              this.renderItem(item, index) :
              null;
          })
        }
      </List>
    );
  }
};

const mapStateToProps = (state: IAppState) => {
  return {
    userRole: state.user.details.role,
  };
};

export const AdminMenu = connect<any, any, IAdminMenuProps>(mapStateToProps)(AdminMenuComponent);
