import React, { useState, ChangeEvent, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { useIntl, defineMessages } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';

import { Price } from 'data-models';
import { IAppState } from 'types';
import { getPriceFilterValue } from 'selectors';
import { Popup } from 'components/popup';
import { getDisplayPrice } from 'components/price';
import { GLOBAL_CURRENCY } from 'global-utils/constants';
import { setPriceFilter } from 'actions/filters';
import { getPriceQueryParam } from 'client-utils/methods';
import { isNumber } from 'global-utils/methods';
import { Button } from 'components/button';
import { useStyles } from './styles';
import { MatchParams } from '../../types';

const messages = defineMessages({
  selectPrice: {
    id: 'client.filters.select_price',
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
  cityId: string;
  params: MatchParams;
  history: History;
};

export function PriceFilter(props: Props) {
  const intl = useIntl();
  const filterValue = useSelector<IAppState, Price>(state => getPriceFilterValue(state, props.params.cityAlias));
  const [price, setPrice] = useState<Price>(filterValue);
  const [popupKey, setPopupKey] = useState(1);
  const [displayPrice, setDisplayPrice] = useState(getDisplayPrice(price, intl, GLOBAL_CURRENCY));
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (filterValue.from !== price.from || filterValue.to !== price.to) {
      setPrice(filterValue);
      setDisplayPrice(getDisplayPrice(filterValue, intl, GLOBAL_CURRENCY));
    }
  }, [filterValue, intl]);

  const hasError = () => {
    if (isNumber(price.from) && isNumber(price.to)) {
      return price.from >= price.to;
    }

    return false;
  };

  const applyChange = (price: Price) => {
    const url = new URL(document.URL);

    if (!price.from && !price.to) {
      url.searchParams.delete('price');
    } else {
      url.searchParams.set('price', getPriceQueryParam(price));
    }

    props.history.push({ search: url.search });
    dispatch(setPriceFilter(props.cityId, price));
  };

  const handleApply = () => {
    if (!hasError()) {
      setDisplayPrice(getDisplayPrice(price, intl, GLOBAL_CURRENCY));
      setPopupKey(Math.random());
      applyChange(price);
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
