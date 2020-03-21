import { defineMessages, IntlShape } from 'react-intl';
import { Price } from 'global-utils/typings';

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

export const getSinglePrice = (price: number | null, ...params: Params) => {
  const [intl] = params;
  return intl.formatMessage(messages.priceFrom, { value: price ? formatPrice(price, ...params) : price });
};

export const getPriceRange = (price: Price, ...params: Params) => Object.values(price)
  .map((price, index) => price && index === 1 ? formatPrice(price, ...params) : price)
  .join('-');

export const getDisplayPrice = (price: Price, ...params: Params) => {
  if (!price.from && !price.to) return '';

  return !price.to
    ? getSinglePrice(price.from, ...params)
    : getPriceRange(price, ...params);
};
