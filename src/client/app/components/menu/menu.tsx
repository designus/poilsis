import * as React from 'react';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { WithStyles } from '@material-ui/core/styles';

import { DropdownMenu } from 'components/dropdownMenu';
import { getCurrentUser } from 'selectors';
import { ICurrentUser, IAppState } from 'types';
import { styles } from './styles';

export interface IMenuItem {
  id: string | number;
  text: string;
  link?: string;
  isDisabled?: boolean;
  allowedRoles?: string[];
  state?: { [key: string]: string };
  items?: IMenuItem[];
  isActive?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
  icon?: () => React.ReactElement<any>;
}

export interface IMenuProps extends Partial<RouteComponentProps<any>>, Partial<WithStyles<typeof styles>> {
  items: IMenuItem[];
  isVertical?: boolean;
  currentUser?: ICurrentUser;
}

const { useState, useEffect } = React;

function Menu(props: IMenuProps) {
  const { classes, currentUser, items, isVertical } = props;
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    const activeItem = items.find(item => item.isActive);
    if (activeItem) {
      setDropdownOpen({ ...dropdownOpen, [activeItem.id]: true });
    }
  }, [items]);

  const isItemVisible = (item: IMenuItem) => {
    if (!currentUser || !item.allowedRoles) {
      return true;
    }

    return item.allowedRoles.indexOf(currentUser.role) !== -1;
  };

  const isDropdownOpen = (item: IMenuItem) => Boolean(dropdownOpen[item.id]);

  const handleDropdownOpen = (item: IMenuItem) => () => {
    const newState = { ...dropdownOpen, [item.id]: !dropdownOpen[item.id] };
    setDropdownOpen(newState);
  };

  const renderItemContent = (item: IMenuItem) => {
    const doesIconExist = typeof item.icon === 'function';
    return (
      <React.Fragment>
        {doesIconExist && (
          <ListItemIcon className={classes.icon}>
            {item.icon()}
          </ListItemIcon>
        )}
        <ListItemText className={classes.text} inset primary={item.text} />
      </React.Fragment>
    );
  };

  const renderCollapsableMenu = (item: IMenuItem) => (
    <React.Fragment>
      <div
        className={classes.collapsableItem}
        onClick={handleDropdownOpen(item)}
      >
        {renderItemContent(item)}
        <ListItemIcon className={classes.icon}>
          {isDropdownOpen(item) ? <ExpandLess /> : <ExpandMore />}
        </ListItemIcon>
      </div>
      <Collapse className={classes.collapsableMenu} in={isDropdownOpen(item)} timeout="auto" unmountOnExit>
        <List>
          {item.items.map(renderItem)}
        </List>
      </Collapse>
    </React.Fragment>
  );

  const renderDropdownMenu = (item: IMenuItem) => (
    <DropdownMenu
      className={classes.dropdownMenu}
      parentItem={<div className={classes.dropdownItem}>{renderItemContent(item)}</div>}
      id={`menu-${item.id}`}
    >
      {item.items.map(renderItem)}
    </DropdownMenu>
  );

  const renderEnabledItem = (item: IMenuItem) => {
    if (item.link) {
      return (
        <NavLink
          to={{
            pathname: item.link,
            state: item.state
          }}
          className={classes.link}
          activeClassName="active"
          exact
        >
          {renderItemContent(item)}
        </NavLink>
      );
    }

    if (item.items) {
      return isVertical ? renderCollapsableMenu(item) : renderDropdownMenu(item);
    }

    if (item.onClick) {
      return (
        <div className={classes.link} onClick={item.onClick}>{renderItemContent(item)}</div>
      );
    }

    return renderItemContent(item);
  };

  const renderDisabledItem = (item: IMenuItem) => {
    return (
      <span className={classes.disabled}>
        {renderItemContent(item)}
      </span>
    );
  };

  const renderListItem = (item: IMenuItem, index: number) => {
    return (
      <ListItem
        key={index}
        disableGutters
        className={`
          ${classes.listItem}
          ${item.isDisabled ? classes.disabled : ''}
          ${item.isActive ? classes.activeItem : ''}
        `}
      >
        {item.isDisabled ? renderDisabledItem(item) : renderEnabledItem(item)}
      </ListItem>
    );
  };

  const renderItem = (item: IMenuItem, index: number) =>
    isItemVisible(item) ? renderListItem(item, index) : null;

  return (
    <List className={classes.list}>
      {items.map(renderItem)}
    </List>
  );
}

const mapStateToProps = (state: IAppState) => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  // @ts-ignore
  connect(mapStateToProps)(Menu)
);
