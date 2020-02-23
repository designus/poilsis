import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Hidden from '@material-ui/core/Hidden';
import { getEnabledCities, getClientLocale } from 'selectors';
import { ICity, Locale } from 'global-utils/typings';
import { getLocalizedText } from 'client-utils/methods';
import { clientRoutes } from 'client-utils/routes';
import { Menu, IMenuItem  } from 'components/menu';

type Props = {};

const getMenuItems = (cities: ICity[], locale: Locale): IMenuItem[] => cities.map(city => ({
  id: city.id,
  text: getLocalizedText(city.name, locale),
  link: clientRoutes.items.getLink(locale, city.alias)
}));

const ClientLeftMenu: React.FunctionComponent<Props> = props => {
  const cities = useSelector(getEnabledCities);
  const locale = useSelector(getClientLocale);

  const menuItems = useMemo<IMenuItem[]>(() => getMenuItems(cities, locale), [cities, locale]);

  return (
    <Menu items={menuItems} />
  );
};

export default memo(ClientLeftMenu);
