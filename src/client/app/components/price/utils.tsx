import { defineMessages, IntlShape } from 'react-intl';
import { Price } from 'data-models';
import { isNumber } from 'global-utils/methods';

type Params = [IntlShape, string];

export const messages = defineMessages({
  priceFrom: {
    id: 'common.price_from',
    defaultMessage: 'from {value}'
  }
});

export const getFormatPriceParams = (currency?: string) => {
  const genericParams = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  };

  if (currency) {
    return {
      ...genericParams,
      style: 'currency',
      currency
    } as const;
  }

  return genericParams;
};

export const formatPrice = (price: number, intl: IntlShape, currency?: string) =>
  intl.formatNumber(price, getFormatPriceParams(currency));

export const getSinglePrice = (price: number | null, ...params: Params) => {
  const [intl] = params;
  return intl.formatMessage(messages.priceFrom, { value: formatPrice(Number(price), ...params) });
};

export const getPriceRange = (price: Price, ...params: Params) => {
  const [intl, currency] = params;
  return Object.values(price)
    // We want to add currency symbol to the second price only: 25-45EUR
    .map((price, index) => index === 0
      ? formatPrice(Number(price), intl)
      : formatPrice(Number(price), intl, currency)
    )
    .join('-');
};

export const getDisplayPrice = (price: Price, ...params: Params) => {
  if (!isNumber(price.from) && !isNumber(price.to)) return '';

  return !isNumber(price.to)
    ? getSinglePrice(price.from, ...params)
    : getPriceRange(price, ...params);
};
