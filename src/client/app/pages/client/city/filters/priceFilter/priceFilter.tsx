import React, { useState, ChangeEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import { useIntl, defineMessages } from 'react-intl';
import { Popup } from 'components/popup';
import { getDisplayPrice } from 'components/price';
import { GLOBAL_CURRENCY } from 'global-utils/constants';
import { Button } from 'components/button';
import { useStyles } from './styles';

const messages = defineMessages({
  selectPrice: {
    id: 'common.select_price',
    defaultMessage: 'Select price'
  },
  from: {
    id: 'common.from',
    defaultMessage: 'From'
  },
  to: {
    id: 'common.to',
    defaultMessage: 'To'
  },
  apply: {
    id: 'common.apply',
    defaultMessage: 'Apply'
  }
});

type Props = {
  selectedValue: number[];
  onClick: (values: number[]) => void;
};

export function PriceFilter(props: Props) {
  const intl = useIntl();
  const [value, setValue] = useState<number[]>(props.selectedValue);
  const [hasError, setHasError] = useState(false);
  const [popupOpen, setPopupOpen] = useState(true);
  const [displayPrice, setDisplayPrice] = useState(getDisplayPrice(value, intl, GLOBAL_CURRENCY));
  const [priceFrom, priceTo] = value;
  const classes = useStyles();
  const isDisabled = !priceFrom || hasError;

  const handleApply = () => {
    if (!hasError) {
      setDisplayPrice(getDisplayPrice(value, intl, GLOBAL_CURRENCY));
      setPopupOpen(false);
      props.onClick(value);
    }
  };

  const handleChange = (type: 'from' | 'to') => (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    const positiveValue = newValue < 0 ? 0 : newValue;
    const value = type === 'from' ? [positiveValue, priceTo] : [priceFrom, positiveValue];

    setValue(value);

    if (type === 'from') {
      setHasError(!newValue || newValue >= priceTo);
    } else {
      setHasError(!priceFrom || newValue <= priceFrom);
    }

  };

  return (
    <Popup
      label={intl.formatMessage(messages.selectPrice)}
      maxWidth={150}
      value={displayPrice}
      isOpen={popupOpen}
    >
      <TextField
        label={intl.formatMessage(messages.from)}
        value={priceFrom || ''}
        fullWidth
        required
        error={hasError}
        type="number"
        size="small"
        onChange={handleChange('from')}
        className={classes.input}
      />
      <TextField
        label={intl.formatMessage(messages.to)}
        value={priceTo || ''}
        fullWidth
        type="number"
        size="small"
        onChange={handleChange('to')}
        className={classes.input}
      />
      <Button
        disabled={isDisabled}
        onClick={handleApply}
        borderRadius={16}
        size="small"
      >
        {intl.formatMessage(messages.apply)}
      </Button>
    </Popup>
  );
}
