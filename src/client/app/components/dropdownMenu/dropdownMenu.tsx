import React, { useEffect } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';

import { styles } from './styles';

interface IDropdownMenu extends WithStyles<typeof styles> {
  parentItem: React.ReactElement<any>;
  id: string;
  isDropdownOpen?: boolean;
  className?: any;
}

const DropdownMenu: React.FunctionComponent<IDropdownMenu> = props => {
  const { useState } = React;
  const [dropdownOpen, setDropdownOpen] = useState(props.isDropdownOpen || false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { children, parentItem, id, classes, className } = props;

  useEffect(() => {
    if (typeof props.isDropdownOpen !== 'undefined') {
      setDropdownOpen(props.isDropdownOpen);
    }

  }, [props.isDropdownOpen]);

  const handleMenuOpen = (event: any) => {
    setDropdownOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const parentElement = React.cloneElement(parentItem, {
    className: `${parentItem.props.className} ${dropdownOpen ? 'active' : ''} `,
    onClick: handleMenuOpen
   });

  const handleMenuclose = () => {
    setDropdownOpen(false);
  };

  return (
    <React.Fragment>
      {parentElement}
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={dropdownOpen}
        onClose={handleMenuclose}
        classes={{ paper: className ? className : classes.wrapper }}
      >
        {children}
      </Menu>
    </React.Fragment>
  );
};

export default withStyles(styles)(DropdownMenu);
