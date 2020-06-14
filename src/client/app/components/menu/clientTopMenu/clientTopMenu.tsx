import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';

import { getClientLocale, getEnabledCities, getActiveItem } from 'selectors';
import { IAppState, ActiveItem } from 'types';
import { IMenuItem  } from 'components/menu';
import { adminRoutes, clientRoutes } from 'client-utils/routes';
import { getLocalizedText } from 'client-utils/methods';
import { callFn } from 'global-utils';
import { City } from 'global-utils/data-models';

import { HorizontalMenu } from './horizontalMenu';
import { VerticalMenu } from './verticalMenu';
import { ITopMenuProps, IOwnProps, IStateProps } from './types';

const { useEffect } = React;

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

const ClientTopMenu: React.FunctionComponent<ITopMenuProps> = props => {
  const { activeItem, cities, isLoggedIn, locale, isVertical, onRouteChange } = props;
  const intl = useIntl();

  const StyledTopMenu = isVertical ? VerticalMenu : HorizontalMenu;

  const getCityItems = () => cities.map(city => ({
    id: city.id,
    text: getLocalizedText(locale, city.name),
    link: clientRoutes.items.getLink(locale, city.alias)
  }));

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
        isActive: [ActiveItem.City, ActiveItem.Type, ActiveItem.Item].includes(activeItem),
        items: getCityItems()
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
    callFn(onRouteChange);
  }, [props.location.pathname]);

  return (
    <StyledTopMenu isVertical={isVertical} items={getMenuItems()} />
  );
};

const mapStateToProps = (state: IAppState, props: IOwnProps): IStateProps => ({
  locale: getClientLocale(state),
  cities: getEnabledCities(state),
  activeItem: getActiveItem(state, props.location.pathname)
});

export default withRouter(
  connect<IStateProps, {}, IOwnProps, IAppState>(mapStateToProps)(ClientTopMenu)
);
