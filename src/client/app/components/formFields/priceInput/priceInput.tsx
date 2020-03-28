import React, { useState, useCallback, ChangeEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import { useIntl, defineMessages } from 'react-intl';
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
    const newValue = { ...price, [type]: value };
    setPrice(newValue);
    updateGlobalState(newValue);
  };

  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <TextField
          label={intl.formatMessage(messages.from)}
          value={price.from || ''}
          fullWidth
          required
          // error={hasError()}
          type="number"
          onChange={handleChange('from')}
          className={classes.formControl}
        />
      </div>
      <div className={classes.wrapper}>
        <TextField
          label={intl.formatMessage(messages.to)}
          value={price.to || ''}
          fullWidth
          type="number"
          onChange={handleChange('to')}
          className={classes.formControl}
        />
      </div>
    </React.Fragment>
  );
}

export default PriceInput as any;
