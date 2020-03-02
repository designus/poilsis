import React, { useEffect } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { IAppState, IItemsMap, CitiesMap } from 'types';
import { Locale } from 'global-utils/typings';
import { loadRecommendedItems } from 'actions';
import { ItemCard } from 'components/itemCard';
import { getRecommendedItems, hasRecommendedItemsLoaded, getItemsMap, getClientLocale, getCitiesMap } from 'selectors';
import { isItemEnabled } from 'client-utils/methods';

import { styles } from './styles';

interface IOwnProps extends WithStyles<typeof styles> {}

interface IDispatchProps {
  loadRecommendedItems: () => void;
}

interface IStateProps {
  recommendedItems: string[];
  hasLoaded: boolean;
  itemsMap: IItemsMap;
  citiesMap: CitiesMap;
  locale: Locale;
}

type RecommendedItemsProps = IOwnProps & IStateProps & IDispatchProps;

export const loadRecommendedItemsData = (store: any) => store.dispatch(loadRecommendedItems());

function RecommendedItems(props: RecommendedItemsProps) {
  const { recommendedItems, hasLoaded, loadRecommendedItems, classes, itemsMap, citiesMap, locale } = props;

  useEffect(() => {
    if (!hasLoaded) {
      loadRecommendedItems();
    }
  }, [hasLoaded, loadRecommendedItems]);

  const renderItem = (itemId: string) => {
    const item = itemsMap[itemId];
    const city = citiesMap[item.cityId];
    return isItemEnabled(item, city, locale) && (
      <Grid key={itemId} item xs={6} md={3} lg={2}>
        <ItemCard city={city} item={item} locale={locale} />
      </Grid>
    );
  };

  const renderItems = () => {
    return (
      <Grid className={classes.grid} spacing={2} container>
        {recommendedItems.map(renderItem)}
      </Grid>
    );
  };

  return (
    <div className={classes.wrapper}>
      <Typography variant="h2">
        <FormattedMessage id="client.home.recommended" defaultMessage="Recommended" />
      </Typography>
      {hasLoaded && renderItems()}
    </div>
  );
}

const mapStateToProps = (state: IAppState): IStateProps => ({
  recommendedItems: getRecommendedItems(state),
  hasLoaded: hasRecommendedItemsLoaded(state),
  itemsMap: getItemsMap(state),
  citiesMap: getCitiesMap(state),
  locale: getClientLocale(state)
});

const mapDispatchToProps: IDispatchProps = {
  loadRecommendedItems
};

export default connect<IStateProps, IDispatchProps, {}, IAppState>(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(RecommendedItems)
);
