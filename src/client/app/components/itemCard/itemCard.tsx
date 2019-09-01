import React, { useEffect } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { IItem } from 'global-utils/typings';
import { getLocalizedText } from 'client-utils/methods';
import { config } from 'config';

import { styles } from './styles';

interface ItemCardProps extends WithStyles<typeof styles> {
  item: IItem;
  locale: string;
}

function ItemCard(props: ItemCardProps) {
  const { item, locale, classes } = props;
  return (
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
  )
}

export default withStyles(styles)(ItemCard);
