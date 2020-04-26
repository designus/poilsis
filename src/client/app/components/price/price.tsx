import React from 'react';
import { useIntl } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import { Price } from 'data-models';
import { getDisplayPrice } from './utils';

import { useStyles } from './styles';

type Props = {
  price: Price | null;
  currency: string;
};

export const PriceDisplay: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const intl = useIntl();
  const { price, currency } = props;

  if (!price) return null;

  return (
    <div className={classes.price}>
      <Typography variant="body2" >
        {getDisplayPrice(price, intl, currency)}
      </Typography>
    </div>
  );
};
