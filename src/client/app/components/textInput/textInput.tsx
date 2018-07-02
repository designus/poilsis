import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { ValidationErrors } from '../../components';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { WithStyles } from '@material-ui/core';
import { styles } from './styles';

export interface ITextInputProps extends WrappedFieldProps, WithStyles<typeof styles> {}

export const InputComponent = (props: ITextInputProps) => {
  const { classes, input, label, meta } = props;
  const showError = Boolean(meta.touched && meta.invalid && meta.error);
  return (
    <div className={classes.wrapper}>
      <FormControl className={classes.formControl} error={showError}>
        <InputLabel htmlFor={label}>
          {label}
        </InputLabel>
        <Input
          id={label}
          value={input.value}
          onChange={input.onChange}
          classes={{
            error: classes.error,
          }}
          margin="dense"
        />
      </FormControl>
      <ValidationErrors
        showError={showError}
        error={meta.error}
      />
    </div>
  );
};

export const TextInput = withStyles(styles)(InputComponent) as any;
