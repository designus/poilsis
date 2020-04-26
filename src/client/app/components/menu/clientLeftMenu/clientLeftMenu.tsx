import React, { memo, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { getEnabledCities, getClientLocale } from 'selectors';
import { Locale } from 'global-utils/typings';
import { City } from 'data-models';
import { getLocalizedText } from 'client-utils/methods';
import { clientRoutes } from 'client-utils/routes';
import { Menu, IMenuItem  } from 'components/menu';
import { styles } from './styles';

type Props = {};

const MenuWithStyles = withStyles(styles)(Menu);

const getMenuItems = (cities: City[], locale: Locale): IMenuItem[] => cities.map(city => ({
  id: city.id,
  text: getLocalizedText(locale, city.name),
  link: clientRoutes.items.getLink(locale, city.alias)
}));

const ClientLeftMenu: React.FunctionComponent<Props> = props => {
  const cities = useSelector(getEnabledCities);
  const locale = useSelector(getClientLocale);

  const menuItems = useMemo<IMenuItem[]>(() => getMenuItems(cities, locale), [cities, locale]);

  return (
    <MenuWithStyles items={menuItems} />
  );
};

export default memo(ClientLeftMenu);
