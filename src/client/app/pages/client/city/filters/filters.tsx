import React, { memo, useMemo, useState } from 'react';
import { useParams, useHistory, withRouter } from 'react-router-dom';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl, defineMessages } from 'react-intl';
import { getTypes, getClientLocale, getCityFilters } from 'selectors';
import { ICityFilters, Price } from 'global-utils/typings';
import { setCityFilters } from 'actions/cities';
import { getLocalizedText } from 'client-utils/methods';
import { DEFAULT_CITY_FITLERS } from 'client-utils/constants';
import { Dropdown } from 'components/dropdown';
import { IDropdownOption, IAppState, DropdownItemValue } from 'types';
import { PriceFilter } from './priceFilter';

import { MatchParams } from '../types';

import { useStyles } from './styles';

type Props = {
  cityId: string;
};

const messages = defineMessages({
  allTypes: {
    id: 'client.filters.all_types',
    defaultMessage: 'All types'
  }
});

const Filters: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const params = useParams<MatchParams>();
  const history = useHistory() as History;
  const filters = useSelector<IAppState, ICityFilters | undefined>(state => getCityFilters(state, params.cityAlias));
  const locale = useSelector(getClientLocale);
  const types = useSelector(getTypes);
  const dispatch = useDispatch();
  const intl = useIntl();

  const typeOptions = useMemo(() =>
    [
      {
        label: intl.formatMessage(messages.allTypes),
        value: DEFAULT_CITY_FITLERS.type
      },
      ...types.map((type): IDropdownOption => ({ label: getLocalizedText(type.name, locale), value: type.id }))
    ],
    [types]
  );

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
      <Dropdown
        options={typeOptions}
        onChange={handleTypeChange}
        disableUnderline={false}
        selectedValue={filters.type}
        label="Select type"
        minWidth={120}
      />
      <PriceFilter
        onClick={handlePriceFilterChange}
        selectedValue={filters.price}
      />
    </div>
  );
};

export default memo(Filters);
