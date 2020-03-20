import { defineMessages, IntlShape } from 'react-intl';

type Params = [IntlShape, string];

const messages = defineMessages({
  priceFrom: {
    id: 'common.price_from',
    defaultMessage: 'from {value}'
  }
});

export const formatPrice = (price: number, intl: IntlShape, currency: string) => intl.formatNumber(price, {
  style: 'currency',
  currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export const getSinglePrice = (price: number, ...params: Params) => {
  const [intl] = params;
  return intl.formatMessage(messages.priceFrom, { value: formatPrice(price, ...params) });
};

export const getPriceRange = (prices: number[], ...params: Params) => prices
  .map((price, index) => index === 1 ? formatPrice(price, ...params) : price)
  .join('-');

export const getDisplayPrice = (price: number[], ...params: Params) => price.length === 1
   ? getSinglePrice(price[0], ...params)
   : getPriceRange(price, ...params);
