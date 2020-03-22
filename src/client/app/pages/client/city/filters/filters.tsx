import React, { memo, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import { getCityFilters } from 'selectors';
import { Price } from 'global-utils/typings';
import { setCityFilters } from 'actions/filters';
import { DEFAULT_CITY_FITLERS } from 'client-utils/constants';
import { getPriceQueryParam } from 'client-utils/methods';
import { IAppState, DropdownItemValue, ICityFilters } from 'types';
import { PriceFilter } from './priceFilter';
import { TypesFilter } from './typesFilter';
import { MatchParams } from '../types';

import { useStyles } from './styles';
import { getFiltersFromSearchParams } from './utils';

type Props = {
  cityId: string;
};

const Filters: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const params = useParams<MatchParams>();
  const history = useHistory() as History;
  const filters = useSelector<IAppState, ICityFilters | undefined>(state => getCityFilters(state, params.cityAlias));
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const filters = getFiltersFromSearchParams(searchParams);
    dispatch(setCityFilters(props.cityId, filters));
  }, []);

  if (!filters) return null;

  const handleTypeChange = (val: DropdownItemValue) => {
    const value = val as string;
    const newFilters: ICityFilters = { ...filters, type: value };
    const url = new URL(document.URL);

    if (value === DEFAULT_CITY_FITLERS.type) {
      url.searchParams.delete('type');
    } else {
      url.searchParams.set('type', value);
    }

    history.push({ search: url.search });
    dispatch(setCityFilters(props.cityId, newFilters));
  };

  const handlePriceFilterChange = (price: Price) => {
    const newFilters: ICityFilters = { ...filters, price };
    const url = new URL(document.URL);

    if (!price.from && !price.to) {
      url.searchParams.delete('price');
    } else {
      url.searchParams.set('price', getPriceQueryParam(price));
    }

    history.push({ search: url.search });
    dispatch(setCityFilters(props.cityId, newFilters));
  };

  return (
    <div className={classes.wrapper}>
      <TypesFilter
        onChange={handleTypeChange}
        selectedValue={filters.type}
      />
      <PriceFilter
        onChange={handlePriceFilterChange}
        selectedValue={filters.price}
      />
    </div>
  );
};

export default memo(Filters);
