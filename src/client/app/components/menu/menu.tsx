import React, { useState, useEffect, memo } from 'react';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { DropdownMenu } from 'components/dropdownMenu';
import { UserRoles } from 'global-utils/typings';
import { getCurrentUser } from 'selectors';
import { UserDetails } from 'types';
import { useStyles } from './styles';

export interface IMenuItem {
  id: string | number;
  text: string;
  link?: string;
  isDisabled?: boolean;
  allowedRoles?: UserRoles[];
  state?: { [key: string]: string };
  items?: IMenuItem[];
  isActive?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
  icon?: () => React.ReactElement<any>;
}

export interface IMenuProps {
  items: IMenuItem[];
  isVertical?: boolean;
}

const Menu: React.FunctionComponent<IMenuProps> = props => {
  const { items, isVertical } = props;
  const [collapsableMenuOpen, setCollapsableMenuOpen] = useState<{[key: string]: boolean}>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const classes = useStyles(props);
  const currentUser = useSelector(getCurrentUser);

  useEffect(() => {
    const activeItem = items.find(item => item.isActive);
    if (activeItem) {
      setCollapsableMenuOpen({ ...collapsableMenuOpen, [activeItem.id]: true });
    }
  }, [items]);

  const isItemVisible = (item: IMenuItem) => {
    if (!currentUser || !item.allowedRoles || !currentUser.role) {
      return true;
    }

    return item.allowedRoles.indexOf(currentUser.role) !== -1;
  };

  const isCollapsableMenuOpen = (item: IMenuItem) => Boolean(collapsableMenuOpen[item.id]);

  const toggleCollapsableMenu = (item: IMenuItem) => () => {
    const newState = { ...collapsableMenuOpen, [item.id]: !collapsableMenuOpen[item.id] };
    setCollapsableMenuOpen(newState);
  };

  const renderItemContent = (item: IMenuItem) => {
    return (
      <React.Fragment>
        {typeof item.icon === 'function' && (
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
        onClick={toggleCollapsableMenu(item)}
      >
        {renderItemContent(item)}
        <ListItemIcon className={classes.icon}>
          {isCollapsableMenuOpen(item) ? <ExpandLess /> : <ExpandMore />}
        </ListItemIcon>
      </div>
      <Collapse className={classes.collapsableMenu} in={isCollapsableMenuOpen(item)} timeout="auto" unmountOnExit>
        {item.items && (
          <List>
            {item.items.map(renderItem)}
          </List>
        )}
      </Collapse>
    </React.Fragment>
  );

  const renderDropdownMenu = (item: IMenuItem) => {
    return item.items && (
      <DropdownMenu
        className={classes.dropdownMenu}
        isDropdownOpen={isDropdownOpen}
        parentItem={<div className={classes.dropdownItem}>{renderItemContent(item)}</div>}
        id={`menu-${item.id}`}
      >
        {item.items.map(renderItem)}
      </DropdownMenu>
    );
  };

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

  const handleListItemClick = (item: IMenuItem) => (e: any) => {
    e.stopPropagation();
    setIsDropdownOpen(!item.link);
  };

  const renderListItem = (item: IMenuItem, index: number) => {
    return (
      <ListItem
        key={index}
        disableGutters
        onClick={handleListItemClick(item)}
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
};

export default memo<IMenuProps>(Menu);
