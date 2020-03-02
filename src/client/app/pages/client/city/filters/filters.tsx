import React, { memo, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useIntl, defineMessages } from 'react-intl';
import { getTypes, getClientLocale, getSelectedCityFilters } from 'selectors';
import { ICityFilters } from 'global-utils/typings';
import { getLocalizedText } from 'client-utils/methods';
import { Dropdown } from 'components/dropdown';
import { IDropdownOption, IAppState } from 'types';
import { MatchParams } from '../types';

import { useStyles } from './styles';

type Props = {};

const messages = defineMessages({
  allTypes: {
    id: 'client.filters.all_types',
    defaultMessage: 'All types'
  }
});

const Filters: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const params = useParams<MatchParams>();
  const filters = useSelector<IAppState, ICityFilters | undefined>(state => getSelectedCityFilters(state, params.cityAlias));
  const locale = useSelector(getClientLocale);
  const types = useSelector(getTypes);
  const intl = useIntl();

  const typeOptions = useMemo(() =>
    [
      { label: intl.formatMessage(messages.allTypes), value: 'all' },
       ...types.map((type): IDropdownOption => ({ label: getLocalizedText(type.name, locale), value: type.id }))
    ],
    [types]
  );

  if (!filters) return null;

  const handleTypeChange = () => (value: string) => ({});

  return (
    <div className={classes.wrapper}>
      <Dropdown
        options={typeOptions}
        onChange={handleTypeChange}
        selectedValue={filters.type}
      />
    </div>
  );
};

export default memo(Filters);
