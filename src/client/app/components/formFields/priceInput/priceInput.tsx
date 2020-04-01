import React, { useState, useCallback, ChangeEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import { useIntl, defineMessages } from 'react-intl';
import Tooltip from '@material-ui/core/Tooltip';
import { WrappedFieldProps } from 'redux-form';
import { debounce } from 'lodash';

import { Price } from 'global-utils/typings';
import { useStyles } from '../textInput/styles';

type Props = WrappedFieldProps;

const messages = defineMessages({
  from: {
    id: 'common.from',
    defaultMessage: 'From'
  },
  to: {
    id: 'common.to',
    defaultMessage: 'To'
  }
});

function PriceInput(props: Props) {
  const intl = useIntl();
  const classes = useStyles();
  const [price, setPrice] = useState<Price>(props.input.value);

  const updateGlobalState = useCallback(
    debounce(props.input.onChange, 600), [props.input.onChange]
  );

  const handleChange = (type: keyof Price) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newValue = { ...price, [type]: Number(value) };
    setPrice(newValue);
    updateGlobalState(newValue);
  };

  const hasError = (type: keyof Price) => {
    return type === 'from'
      ? !props.meta.valid
      : !props.meta.valid && !props.input.value.from && !props.input.value.to;
  };

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <Tooltip open={hasError('from')} title={props.meta.error || ''} placement="right-end">
          <TextField
            label={intl.formatMessage(messages.from)}
            value={price.from || ''}
            error={hasError('from')}
            type="number"
            onChange={handleChange('from')}
            className={classes.formControl}
          />
        </Tooltip>
      </div>
      <div className={classes.wrapper}>
        <Tooltip open={hasError('to')} title={props.meta.error || ''} placement="right-end">
          <TextField
            label={intl.formatMessage(messages.to)}
            value={price.to || ''}
            fullWidth
            error={hasError('to')}
            type="number"
            onChange={handleChange('to')}
            className={classes.formControl}
          />
        </Tooltip>
      </div>
    </React.Fragment>
  );
}

export default PriceInput as any;
