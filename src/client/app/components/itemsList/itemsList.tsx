'use strict';
import React, { memo, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { List, WindowScroller, AutoSizer } from 'react-virtualized';
import Typography from '@material-ui/core/Typography';
import 'react-virtualized/styles.css';

import { config } from 'config';
import { City, Item } from 'data-models';
import { SMALL_IMAGE_HEIGHT } from 'global-utils/constants';
import { isClient, isServer } from 'global-utils/methods';
import { clientRoutes } from 'client-utils/routes';
import { getLocalizedText, isItemEnabled } from 'client-utils/methods';
import { PriceDisplay } from 'components/price';

import { getClientLocale } from 'selectors';

import { ItemTypesList } from '../itemTypesList';
import { useStyles } from './styles';

type Props = {
  items: Item[];
  selectedCity: City;
};

export const rowHeight = SMALL_IMAGE_HEIGHT + 20;

const ItemsList: React.FunctionComponent<Props> = (props) => {

  const locale = useSelector(getClientLocale);
  const items = props.items || [];
  const classes = useStyles(props);
  const history = useHistory();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = (item: Item) => () => {
    history.push(clientRoutes.item.getLink(locale, props.selectedCity.alias, item.alias));
  };

  const getImageUrl = (item: Item) => item.mainImage
    ? `${config.host}/${item.mainImage}`
    : `${config.host}/images/no-image.png`;

  const renderRow = ({ index, style }: any) => {
    const item = items[index];
    return isItemEnabled(item, props.selectedCity, locale) ? (
      <div className={classes.row} key={item.id} style={style} onClick={handleClick(item)}>
        <div className={classes.item}>
          <div className={classes.image}>
            <img src={getImageUrl(item)} />
          </div>
          <div className={classes.content}>
            <Typography variant="h3" className={classes.name}>
              {getLocalizedText(locale, item.name)}
            </Typography>
            <ItemTypesList locale={locale} typeIds={item.types} />
            <PriceDisplay
              price={item.price}
              currency={item.currency}
            />
          </div>
        </div>
      </div>
    ) : null;
  };

  const renderClientList = () => (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({width}) => (
            <List
              autoHeight
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={items.length}
              rowHeight={rowHeight}
              rowRenderer={renderRow}
              scrollTop={scrollTop}
              width={width}
            />
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );

  const renderServerList = () => items.map((item, index) => renderRow({ index, style: {} }));

  return (
    <div className={classes.wrapper}>
      {isServer() && renderServerList()}
      {isClient() && isMounted ? renderClientList() : null}
    </div>
  );
};

export default memo(ItemsList);
