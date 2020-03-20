import React from 'react';
import { useIntl } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import { getDisplayPrice } from './utils';

import { useStyles } from './styles';

type Props = {
  price: number[];
  currency: string;
};

export const Price: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const intl = useIntl();
  const { price, currency } = props;

  if (!price.length) return null;

  return (
    <div className={classes.price}>
      <Typography variant="body2" >
        {getDisplayPrice(props.price, intl, currency)}
      </Typography>
    </div>
  );
};
