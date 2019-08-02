import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';

import { styles } from './styles';

interface IDropdownMenu extends WithStyles<typeof styles> {
  children: JSX.Element[] | JSX.Element;
  parentItem: JSX.Element | string;
  id: string;
}

const DropdownMenu = (props: IDropdownMenu) => {
  const { useState } = React;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { children, parentItem, id, classes } = props;

  const handleMenuOpen = event => {
    setIsDropdownOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const parentElement = React.cloneElement(parentItem as React.ReactElement<any>, { onClick: handleMenuOpen });

  const handleMenuclose = () => {
    setIsDropdownOpen(false);
  };

  return (
    <React.Fragment>
      {parentElement}
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={isDropdownOpen}
        onClose={handleMenuclose}
        classes={{ paper: classes.wrapper }}
      >
        {children}
      </Menu>
    </React.Fragment>
  );
};

export default withStyles(styles)(DropdownMenu);
