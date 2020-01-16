import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { clientRoutes } from 'client-utils/routes';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { IAppState } from 'types';
import { ICity, Languages } from 'global-utils/typings';
import { getEnabledCities, getTypesMap, getClientLocale } from 'selectors';

import { styles } from './styles';

interface IMainMenu extends Partial<RouteComponentProps<any>>, Partial<WithStyles<typeof styles>> {
  showSubmenu: boolean;
  useWrapper: boolean;
  citiesList?: ICity[];
  locale?: Languages;
}

const MainMenu = (props: IMainMenu) => {
  const { useWrapper, citiesList, showSubmenu, locale } = props;
  // const isSubmenuVisible = (cityId: string, types: string[]) =>
  //   showSubmenu && types.length > 0 && selectedCity.id === cityId;

  const renderCity = (city: ICity) => (
    <MenuItem key={city.id}>
      <NavLink
        activeStyle={{ color: 'red' }}
        to={{
          pathname: clientRoutes.items.getLink(locale, city.alias)
        }}
      >
        {city.name}
      </NavLink>
      {/* {isSubmenuVisible(city.id, city.types) ? getSubmenu(city.alias, city.types, typesMap) : ''} */}
    </MenuItem>
  );

  if (useWrapper) {
    return (
      <MenuList>
        {citiesList.map(renderCity)}
      </MenuList>
    );
  }

  return (
    <React.Fragment>
      {citiesList.map(renderCity)}
    </React.Fragment>
  );
};

const mapStateToProps = (state: IAppState, props) => ({
  typesMap: getTypesMap(state),
  citiesList: getEnabledCities(state),
  locale: getClientLocale(state)
});

const ConnectedComponent = withRouter(
  connect(mapStateToProps)(
    withStyles(styles)(MainMenu)
  )
);

export default React.forwardRef<any, IMainMenu>((props: IMainMenu, ref) =>
  <ConnectedComponent {...props} />
);
