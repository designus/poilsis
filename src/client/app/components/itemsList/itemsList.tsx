'use strict';
import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

import { ICity, IItem, Locale } from 'global-utils/typings';
import { IAppState } from 'types';
import { clientRoutes } from 'client-utils/routes';
import { getLocalizedText, isItemEnabled } from 'client-utils/methods';

import { getClientLocale } from 'selectors';

import { ItemTypesList } from '../itemTypesList';

type Props = {
  items: IItem[];
  selectedCity: ICity;
};

const ItemsList: React.FunctionComponent<Props> = (props) => {

  const locale = useSelector(getClientLocale);
  const items = props.items || [];

  const renderItem = (item: IItem) => {
    return isItemEnabled(item, props.selectedCity, locale) && (
      <NavLink
        key={item.id}
        activeStyle={{ color: 'red' }}
        to={{
          pathname: clientRoutes.item.getLink(locale, props.selectedCity.alias, item.alias)
        }}
      >
        {getLocalizedText(item.name, locale)}<br />
        <ItemTypesList locale={locale} typeIds={item.types} />
        <hr />
      </NavLink>
    );
  };

  return (
    <div className="itemsList">
      {items.map(renderItem)}
    </div>
  );
};

export default memo(ItemsList);
