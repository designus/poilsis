import React, { useEffect } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { getLocalizedText } from 'client-utils/methods';
import { IAppState, IItemsMap } from 'types';
import { loadRecommendedItems } from 'actions';
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
    const item = itemsMap[itemId];
    return (
      <div key={itemId}>
        <Typography variant="h3">{getLocalizedText(item.name, locale)}</Typography>
      </div>
    );
  }

  return hasLoaded && (
    <React.Fragment>
      <Typography variant="h2">Recomenduojame</Typography>
      {recommendedItems.map(renderItem)}
    </React.Fragment>
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
