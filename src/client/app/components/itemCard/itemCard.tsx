import React, { useEffect } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { IItem, ICity } from 'global-utils/typings';
import { getLocalizedText } from 'client-utils/methods';
import { clientRoutes } from 'client-utils/routes';
import { config } from 'config';

import { styles } from './styles';

interface IItemCardProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
  item: IItem;
  city: ICity;
  locale: string;
}

function ItemCard(props: IItemCardProps) {
  const { item, city, locale, classes } = props;

  const handleClick = () => {
    props.history.push(clientRoutes.item.getLink(locale, city.alias, item.alias));
  };

  return (
    <Card onClick={handleClick} className={classes.card}>
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
  );
}

export default withStyles(styles)(withRouter(ItemCard));
