import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { DropdownMenu } from 'components/dropdownMenu';
import { adminRoutes } from 'client-utils/routes';

import { styles } from './styles';

interface ITopMenu extends WithStyles<typeof styles> {
  isLoggedIn: boolean;
  login: (credentials: any) => void;
}

function TopMenu(props: ITopMenu) {
  const { classes, isLoggedIn, login } = props;

  const signIn = (credentials: any) => () => {
    login(credentials);
  };

  return (
    <MenuList disablePadding dense classes={{ root: classes.topMenu }}>
      <MenuItem>Pradinis</MenuItem>
      {isLoggedIn ? (
        <MenuItem>
          <Link to={adminRoutes.items.getLink()}>Admin</Link>
        </MenuItem>
      ) : (
        <DropdownMenu itemName="Login" id="loginMenu">
          <MenuItem onClick={signIn({username: 'admin', password: 'admin'})}>Log in with admin</MenuItem>
          <MenuItem onClick={signIn({username: 'tomas', password: 'tomas'})}>Log in with user</MenuItem>
        </DropdownMenu>
      )}
    </MenuList>
  );
}

export default withStyles(styles)(TopMenu);
