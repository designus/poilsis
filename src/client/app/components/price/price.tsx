import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './styles';

type Props = {
  price: number[];
  currency: string;
};

const messages = defineMessages({
  priceFrom: {
    id: 'common.price_from',
    defaultMessage: 'from {value}'
  }
});

export const Price: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const intl = useIntl();
  const { price, currency } = props;

  if (!price.length) return null;

  const formatPrice = (price: number) => intl.formatNumber(price, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  const getSinglePrice = (price: number) => {
    return intl.formatMessage(messages.priceFrom, {
      value: formatPrice(price)
    });
  };

  const getPriceRange = (prices: number[]) => prices
    .map((price, index) => index === 1 ? formatPrice(price) : price)
    .join('-');

  return (
    <div className={classes.price}>
      <Typography variant="body2" >
        {props.price.length === 1 ? getSinglePrice(price[0]) : getPriceRange(price)}
      </Typography>
    </div>
  );
};
