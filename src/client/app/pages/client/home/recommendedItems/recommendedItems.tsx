import React, { useEffect } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import { config } from 'config';

import { IItem } from 'global-utils/typings';
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
    console.log('Main image', item.mainImage);
    return (
      <Grid key={itemId} item xs={6} md={3} lg={2}>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              className={`${classes.media} ${!item.mainImage ? classes.noImage : ''}`}
              image={item.mainImage || `${config.host}/images/no-image.png`}
            />
            <CardContent>
              <Typography gutterBottom variant="h4">
                {getLocalizedText(item.name, locale)}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                This is short description
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
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
      <Typography variant="h2">Recomenduojame</Typography>
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
