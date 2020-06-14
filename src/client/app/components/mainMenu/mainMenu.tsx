import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { clientRoutes } from 'client-utils/routes';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { IAppState } from 'types';
import { Locale } from 'global-utils/typings';
import { City } from 'global-utils/data-models';
import { getEnabledCities, getClientLocale } from 'selectors';

import { styles } from './styles';

interface IOwnProps extends RouteComponentProps<any>, WithStyles<typeof styles> {
  showSubmenu: boolean;
  useWrapper: boolean;
}

interface IStateProps {
  citiesList: City[];
  locale: Locale;
}

type Props = IOwnProps & IStateProps;

const MainMenu: React.FunctionComponent<Props> = props => {
  const { useWrapper, citiesList, locale } = props;

  const renderCity = (city: City) => (
    <MenuItem key={city.id}>
      <NavLink
        activeStyle={{ color: 'red' }}
        to={{
          pathname: clientRoutes.items.getLink(locale, city.alias)
        }}
      >
        {city.name}
      </NavLink>
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

const mapStateToProps = (state: IAppState): IStateProps => ({
  citiesList: getEnabledCities(state),
  locale: getClientLocale(state)
});

const ConnectedComponent = withRouter(
  connect<IStateProps, {}, IOwnProps, IAppState>(mapStateToProps)(
    withStyles(styles)(MainMenu)
  )
);

export default React.forwardRef<any, any>((props: Props, ref) =>
  <ConnectedComponent {...props} />
);
