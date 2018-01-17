import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

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
}

export interface IAdminMenuProps {
  items: IAdminMenuItem[];
}

export const AdminMenu = ({items}: IAdminMenuProps) => {
  return (
    <List>
      {
        items.map((item: IAdminMenuItem, i) => {
          return (
            <StyledListItem button
              key={i}
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
        })
      }
    </List>
  );
};
