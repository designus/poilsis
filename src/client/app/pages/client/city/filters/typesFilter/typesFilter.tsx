import React, { memo, useMemo } from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { getTypes, getClientLocale, getCityFilters } from 'selectors';
import { getLocalizedText } from 'client-utils/methods';
import { DEFAULT_CITY_FITLERS } from 'client-utils/constants';
import { Dropdown } from 'components/dropdown';
import { IDropdownOption, DropdownItemValue } from 'types';

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
  selectedValue: string;
  onChange: (val: string) => void;
};

function TypesFilter(props: Props) {
  const types = useSelector(getTypes);
  const intl = useIntl();
  const locale = useSelector(getClientLocale);

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

  const handleChange = (val: DropdownItemValue) => props.onChange(val as string);

  return (
    <Dropdown
      options={typeOptions}
      onChange={handleChange}
      disableUnderline={false}
      selectedValue={props.selectedValue}
      label={intl.formatMessage(messages.selectType)}
      minWidth={150}
    />
  );
}

export default memo(TypesFilter);
