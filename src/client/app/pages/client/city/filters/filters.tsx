import React, { memo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import { getCityFilters } from 'selectors';
import { ICityFilters, Price } from 'global-utils/typings';
import { setCityFilters } from 'actions/cities';
import { DEFAULT_CITY_FITLERS } from 'client-utils/constants';
import { IAppState, DropdownItemValue } from 'types';
import { PriceFilter } from './priceFilter';
import { TypesFilter } from './typesFilter';
import { MatchParams } from '../types';

import { useStyles } from './styles';

type Props = {
  cityId: string;
};

const Filters: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const params = useParams<MatchParams>();
  const history = useHistory() as History;
  const filters = useSelector<IAppState, ICityFilters | undefined>(state => getCityFilters(state, params.cityAlias));
  const dispatch = useDispatch();

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
    dispatch(setCityFilters({ cityId: props.cityId, filters: newFilters }));
  };

  const handlePriceFilterChange = (values: Price) => {
    return {};
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
