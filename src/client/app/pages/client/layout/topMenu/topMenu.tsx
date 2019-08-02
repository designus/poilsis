import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { getLocale, getSelectedCityId } from 'selectors';
import { IAppState, ICity } from 'reducers';
import { DropdownMenu } from 'components/dropdownMenu';
import { MainMenu } from 'components/mainMenu';
import { adminRoutes, clientRoutes } from 'client-utils/routes';

import { styles } from './styles';

const { useState, useEffect } = React;

enum ActiveItem {
  Home,
  Offers
}

interface ITopMenu extends RouteComponentProps<any>, WithStyles<typeof styles> {
  isLoggedIn: boolean;
  login: (credentials: any) => void;
  locale: string;
  selectedCityId: string;
}

const getActiveItem = (pathName: string, selectedCityId: string) => {
  if (selectedCityId) {
    return ActiveItem.Offers;
  }

  return ActiveItem.Home;
};

function TopMenu(props: ITopMenu) {
  const { classes, isLoggedIn, login, locale, selectedCityId } = props;
  const [activeItem, setActiveItem] = useState(getActiveItem(props.location.pathname, selectedCityId));

  useEffect(() => {
    setActiveItem(getActiveItem(props.location.pathname, selectedCityId));
  }, [selectedCityId, props.location.pathname]);

  const signIn = (credentials: any) => () => {
    login(credentials);
  };

  const getLogInItem = () => (
    <MenuItem className={`${classes.listItem} ${classes.link}`}>Login</MenuItem>
  );

  const getOffersItem = () => (
    <MenuItem className={`
      ${classes.listItem}
      ${classes.link}
      ${activeItem === ActiveItem.Offers ? classes.active : ''}
    `}>
      Poilsio pasiulymai
    </MenuItem>
  );

  const handleClick = (activeItem: ActiveItem) => () => {
    setActiveItem(activeItem);
  };

  return (
    <MenuList disablePadding classes={{ root: classes.topMenu }}>
      <MenuItem
        onClick={handleClick(ActiveItem.Home)}
        className={`
          ${classes.listItem}
          ${activeItem === ActiveItem.Home ? classes.active : ''}
        `}
      >
        <NavLink
          className={classes.link}
          to={clientRoutes.landing.getLink(locale)}
        >
          Pradinis
        </NavLink>
      </MenuItem>
      <DropdownMenu parentItem={getOffersItem()} id="offersMenu">
        <MainMenu useWrapper={false} showSubmenu={false} />
      </DropdownMenu>
      {isLoggedIn ? (
        <MenuItem className={classes.listItem}>
          <NavLink className={classes.link} to={adminRoutes.items.getLink()}>Admin</NavLink>
        </MenuItem>
      ) : (
        <DropdownMenu parentItem={getLogInItem()} id="loginMenu">
          <MenuItem onClick={signIn({username: 'admin', password: 'admin'})}>Log in with admin</MenuItem>
          <MenuItem onClick={signIn({username: 'tomas', password: 'tomas'})}>Log in with user</MenuItem>
        </DropdownMenu>
      )}
    </MenuList>
  );
}

const mapStateToProps = (state: IAppState, props) => ({
  locale: getLocale(state),
  selectedCityId: getSelectedCityId(state, props.location.state)
});

export default withRouter(
  connect(mapStateToProps)(
    withStyles(styles)(TopMenu)
  )
);
