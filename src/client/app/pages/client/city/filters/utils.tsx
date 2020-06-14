import { Price } from 'global-utils/data-models';
import { ICityFilters } from 'types';
import { isNumber } from 'global-utils/methods';

export const parsePriceFilter = (value: string): Price => value
  .split('-')
  .map(Number)
  .filter(val => isNumber(val))
  .reduce((acc: Price, price, index) => {
    const key = index === 0 ? 'from' : 'to';
    acc[key] = price;
    return acc;
  }, { from: null, to: null });

export const getFiltersFromSearchParams = (searchParams: URLSearchParams): ICityFilters => {
  const paramsList = Array.from(searchParams.entries()) as Array<[keyof ICityFilters, string]>;
  return  paramsList.reduce((acc, [key, value]): ICityFilters => {
    if (key === 'type') {
      acc[key] = value;
    }

    if (key === 'price') {
      acc[key] = parsePriceFilter(value);
    }
    return acc;
  }, {} as ICityFilters);
};
