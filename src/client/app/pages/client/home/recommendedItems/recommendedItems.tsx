import React, { useEffect } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { IAppState, IItemsMap } from 'types';
import { loadRecommendedItems } from 'actions';
import { ItemCard } from 'components/itemCard';
import { getRecommendedItems, hasRecommendedItemsLoaded, getItemsMap, getLocale } from 'selectors';

import { styles } from './styles';

interface IOwnProps extends WithStyles<typeof styles> {}

interface IDispatchProps {
  loadRecommendedItems: () => void;
}

interface IStateProps {
  recommendedItems: string[];
  hasLoaded: boolean;
  itemsMap: IItemsMap;
  locale: string;
}

type RecommendedItemsProps = IOwnProps & IStateProps & IDispatchProps;

function RecommendedItems(props: RecommendedItemsProps) {
  const { recommendedItems, hasLoaded, loadRecommendedItems, classes, itemsMap, locale } = props;

  useEffect(() => {
    if (!hasLoaded) {
      loadRecommendedItems();
    }
  }, [hasLoaded, loadRecommendedItems]);

  const renderItem = (itemId: string) => {
    return (
      <Grid key={itemId} item xs={6} md={3} lg={2}>
        <ItemCard item={itemsMap[itemId]} locale={locale} />
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

const mapStateToProps = (state: IAppState) => ({
  recommendedItems: getRecommendedItems(state),
  hasLoaded: hasRecommendedItemsLoaded(state),
  itemsMap: getItemsMap(state),
  locale: getLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  loadRecommendedItems: () => dispatch(loadRecommendedItems())
});

export default connect<IStateProps, IDispatchProps, {}>(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(RecommendedItems)
);