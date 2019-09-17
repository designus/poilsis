import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, defineMessages } from 'react-intl';

import { getLocale, getCitiesList, getActiveItem } from 'selectors';
import { IAppState } from 'types';
import { IMenuItem  } from 'components/menu';
import { adminRoutes, clientRoutes } from 'client-utils/routes';
import { getLocalizedText } from 'client-utils/methods';
import { callFn } from 'global-utils';
import { ICity } from 'global-utils/typings';

import { HorizontalMenu } from './horizontalMenu';
import { VerticalMenu } from './verticalMenu';
import { ITopMenuProps, ActiveItem, IOwnProps, IStateProps } from './types';
import { styles } from './styles';

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

function ClientTopMenu(props: ITopMenuProps) {
  const { classes, activeItem, cities, isLoggedIn, locale, isVertical, onRouteChange, intl } = props;

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
        isActive: [ActiveItem.City, ActiveItem.Type, ActiveItem.Item].includes(activeItem),
        items: cities.map((city: ICity) => ({
          id: city.id,
          text: getLocalizedText(city.name, locale),
          link: clientRoutes.items.getLink(locale, city.alias)
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
    callFn(onRouteChange);
  }, [props.location.pathname]);

  return (
    <StyledTopMenu isVertical={isVertical} items={getMenuItems()} />
  );
}

const mapStateToProps = (state: IAppState, props: IOwnProps) => ({
  locale: getLocale(state),
  cities: getCitiesList(state),
  activeItem: getActiveItem(state, props.location.pathname)
});

export default withStyles(styles)(
  withRouter(
    injectIntl(
      connect<IStateProps, {}, IOwnProps>(mapStateToProps)(ClientTopMenu)
    )
  )
);
