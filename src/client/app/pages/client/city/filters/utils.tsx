import { Price } from 'global-utils/typings';
import { ICityFilters } from 'types';

export const parsePriceFilter = (value: string): Price => value
  .split('-')
  .map(Number)
  .filter(Boolean)
  .reduce((acc: Price, price, index) => {
    const key = index === 0 ? 'from' : 'to';
    acc[key] = price;
    return acc;
  }, { from: 0, to: null });

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
