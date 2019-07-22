import * as React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

interface IDropdownMenu {
  children: JSX.Element[] | JSX.Element;
  itemName: string;
  id: string;
}

export const DropdownMenu = (props: IDropdownMenu) => {
  const { useState, useEffect } = React;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { children, itemName, id } = props;

  // useEffect(() => {
  //   setIsDropdownOpen(false);
  //   setAnchorEl(null);
  // });

  const handleMenuOpen = event => {
    setIsDropdownOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuclose = () => {
    setIsDropdownOpen(false);
  };

  return (
    <React.Fragment>
      <MenuItem onClick={handleMenuOpen}>
        {itemName}
      </MenuItem>
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={isDropdownOpen}
        onClose={handleMenuclose}
      >
        {children}
      </Menu>
    </React.Fragment>
  );
};
