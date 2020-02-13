'use strict';
import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { List, WindowScroller, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';

import { ICity, IItem } from 'global-utils/typings';
import { isClient } from 'global-utils/methods';
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
    return (
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

  const renderRow = ({ index, style }: any) => {
    const item = items[index];
    return isItemEnabled(item, props.selectedCity, locale) ? (
      <div key={item.id} style={style} >
        {renderItem(item)}
      </div>
    ) : null;
  };

  const renderClientList = () => (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <div>
          <AutoSizer disableHeight>
            {({width}) => (
              <List
                autoHeight
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowCount={items.length}
                rowHeight={50}
                rowRenderer={renderRow}
                scrollTop={scrollTop}
                width={width}
              />
            )}
          </AutoSizer>
        </div>
      )}
    </WindowScroller>
  );

  const renderServerList = () => items.map((item, index) => renderRow({ index, style: {} }));

  return (
    <React.Fragment>
      {isClient() ? renderClientList() : renderServerList()}
    </React.Fragment>
  );
};

export default memo(ItemsList);
