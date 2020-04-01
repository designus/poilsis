import { createIntl, createIntlCache } from 'react-intl';
import { getPriceRange, getSinglePrice, getDisplayPrice } from './utils';

describe('PriceDisplay', () => {
  const currency = 'EUR';
  const intl = createIntl({
    locale: 'en-US',
    messages: {
      'common.price_from': 'from {value}'
    }
  }, createIntlCache());

  it('getPriceRange()', () => {
    expect(getPriceRange({ from: 0, to: 45 }, intl, currency)).toBe('0-€45');
    expect(getPriceRange({ from: null, to: 45 }, intl, currency)).toBe('0-€45');
  });

  it('getSinglePrice()', () => {
    expect(getSinglePrice(10, intl, currency)).toBe('from €10');
    expect(getSinglePrice(null, intl, currency)).toBe('from €0');
  });

  it('getDisplayPrice()', () => {
    expect(getDisplayPrice({ from: 0, to: 10 }, intl, currency)).toBe('0-€10');
    expect(getDisplayPrice({ from: null, to: 20 }, intl, currency)).toBe('0-€20');
    expect(getDisplayPrice({ from: 20, to: null }, intl, currency)).toBe('from €20');
  });
});
