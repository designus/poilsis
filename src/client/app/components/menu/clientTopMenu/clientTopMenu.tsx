import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl';

import { getLocale, getCities, getSelectedCityId } from 'selectors';
import { IAppState, ICityLocalized } from 'types';
import { IMenuItem  } from 'components/menu';
import { adminRoutes, clientRoutes } from 'client-utils/routes';
import { callFn } from 'global-utils';

import { HorizontalMenu } from './horizontalMenu';
import { VerticalMenu } from './verticalMenu';
import { styles } from './styles';

const { useState, useEffect } = React;

const messages = defineMessages({
  home: {
    id: 'client.header.top_menu.home',
    defaultMessage: 'Home'
  },
  items: {
    id: 'client.header.top_menu.items',
    defaultMessage: 'Items'
  },
  admin: {
    id: 'client.header.top_menu.admin',
    defaultMessage: 'Admin'
  }
});

enum ActiveItem {
  Home,
  Offers
}

interface IOwnProps extends RouteComponentProps<any>, WithStyles<typeof styles>, InjectedIntlProps {
  onRouteChange?: () => void;
  login?: (credentials: any) => void;
  isVertical?: boolean;
  isLoggedIn?: boolean;
}

interface IStateProps {
  locale?: string;
  cities?: ICityLocalized[];
  selectedCityId?: string;
}

type ITopMenu = IStateProps & IOwnProps;

const getActiveItem = (pathName: string, selectedCityId: string) => {
  if (selectedCityId) {
    return ActiveItem.Offers;
  }

  return ActiveItem.Home;
};

function ClientTopMenu(props: ITopMenu) {
  const { classes, cities, isLoggedIn, locale, selectedCityId, isVertical, onRouteChange, intl } = props;
  const [activeItem, setActiveItem] = useState(getActiveItem(props.location.pathname, selectedCityId));

  const StyledTopMenu = isVertical ? VerticalMenu : HorizontalMenu;

  const getMenuItems = (): IMenuItem[] => {
    const menuItems: IMenuItem[] = [
      {
        id: 1,
        link: clientRoutes.landing.getLink(locale),
        text: intl.formatMessage(messages.home),
        isActive: activeItem === ActiveItem.Home
      },
      {
        id: 2,
        text: intl.formatMessage(messages.items),
        isActive: activeItem === ActiveItem.Offers,
        items: cities.map((city: ICityLocalized) => ({
          id: city.id,
          text: city.name,
          link: clientRoutes.items.getLink(locale, city.alias),
          state: {
            cityId: city.id
          }
        }))
      }
    ];

    if (isLoggedIn) {
      menuItems.push({
        id: 3,
        text: intl.formatMessage(messages.admin),
        link: adminRoutes.items.getLink()
      });
    }

    return menuItems;
  };

  useEffect(() => {
    setActiveItem(getActiveItem(props.location.pathname, selectedCityId));
    callFn(onRouteChange);
  }, [selectedCityId, props.location.pathname]);

  return (
    <StyledTopMenu isVertical={isVertical} items={getMenuItems()} />
  );
}

const mapStateToProps = (state: IAppState, props: IOwnProps) => ({
  locale: getLocale(state),
  cities: getCities(state),
  selectedCityId: getSelectedCityId(state, props.location.state)
});

export default withStyles(styles)(
  withRouter(
    injectIntl(
      connect<IStateProps, {}, IOwnProps>(mapStateToProps)(ClientTopMenu)
    )
  )
);
