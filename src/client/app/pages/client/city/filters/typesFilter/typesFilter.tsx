import React, { memo, useMemo } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';
import { getTypes, getClientLocale, getTypeFilterValue } from 'selectors';
import { getLocalizedText } from 'client-utils/methods';
import { DEFAULT_CITY_FITLERS } from 'client-utils/constants';
import { setTypeFilter } from 'actions/filters';
import { Dropdown } from 'components/dropdown';
import { IDropdownOption, DropdownItemValue, IAppState } from 'types';
import { MatchParams } from '../../types';

const messages = defineMessages({
  allTypes: {
    id: 'client.filters.all_types',
    defaultMessage: 'All types'
  },
  selectType: {
    id: 'client.filters.select_type',
    defaultMessage: 'Select type'
  }
});

type Props = {
  cityId: string;
  params: MatchParams;
  history: History;
};

function TypesFilter(props: Props) {
  const types = useSelector(getTypes);
  const intl = useIntl();
  const locale = useSelector(getClientLocale);
  const dispatch = useDispatch();
  const filterValue = useSelector<IAppState, string>(state => getTypeFilterValue(state, props.params.cityAlias));

  const typeOptions = useMemo(() =>
    [
      {
        label: intl.formatMessage(messages.allTypes),
        value: DEFAULT_CITY_FITLERS.type
      },
      ...types.map((type): IDropdownOption => ({ label: getLocalizedText(locale, type.name), value: type.id }))
    ],
    [types]
  );

  const handleChange = (val: DropdownItemValue) => {
    const value = val as string;
    const url = new URL(document.URL);

    if (value === DEFAULT_CITY_FITLERS.type) {
      url.searchParams.delete('type');
    } else {
      url.searchParams.set('type', value);
    }

    props.history.push({ search: url.search });
    dispatch(setTypeFilter(props.cityId, value));
  };

  return (
    <Dropdown
      options={typeOptions}
      onChange={handleChange}
      disableUnderline={false}
      selectedValue={filterValue}
      label={intl.formatMessage(messages.selectType)}
      minWidth={150}
    />
  );
}

export default memo(TypesFilter);
