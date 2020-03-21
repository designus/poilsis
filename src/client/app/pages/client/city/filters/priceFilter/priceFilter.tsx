import React, { useState, ChangeEvent, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { useIntl, defineMessages } from 'react-intl';
import { Price } from 'global-utils/typings';
import { Popup } from 'components/popup';
import { getDisplayPrice } from 'components/price';
import { GLOBAL_CURRENCY } from 'global-utils/constants';
import { isNumber } from 'global-utils/methods';
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
  selectedValue: Price;
  onClick: (values: Price) => void;
};

export function PriceFilter(props: Props) {
  const intl = useIntl();
  const [price, setPrice] = useState<Price>(props.selectedValue);
  const [popupKey, setPopupKey] = useState(1);
  const [displayPrice, setDisplayPrice] = useState(getDisplayPrice(price, intl, GLOBAL_CURRENCY));
  const classes = useStyles();

  const hasError = () => {
    const isFromNumber = typeof price.from === 'number';
    const isToNumber = typeof price.to === 'number';

    if (isNumber(price.from) && isNumber(price.to)) {
      return price.from >= price.to;
    }

    if (!isFromNumber && isToNumber) {
      return true;
    }

    return false;
  };

  const handleApply = () => {
    if (!hasError()) {
      setDisplayPrice(getDisplayPrice(price, intl, GLOBAL_CURRENCY));
      setPopupKey(Math.random());
      props.onClick(price);
    }
  };

  const handleChange = (type: keyof Price) => (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    const positiveValue = !newValue || newValue < 0 ? null : newValue;
    setPrice({ ...price, [type]: positiveValue });
  };

  return (
    <Popup
      label={intl.formatMessage(messages.selectPrice)}
      maxWidth={150}
      value={displayPrice}
      popupKey={popupKey}
    >
      <TextField
        label={intl.formatMessage(messages.from)}
        value={price.from || ''}
        fullWidth
        required
        error={hasError()}
        type="number"
        size="small"
        onChange={handleChange('from')}
        className={classes.input}
      />
      <TextField
        label={intl.formatMessage(messages.to)}
        value={price.to || ''}
        fullWidth
        type="number"
        size="small"
        onChange={handleChange('to')}
        className={classes.input}
      />
      <Button
        disabled={hasError()}
        onClick={handleApply}
        borderRadius={16}
        size="small"
      >
        {intl.formatMessage(messages.apply)}
      </Button>
    </Popup>
  );
}
