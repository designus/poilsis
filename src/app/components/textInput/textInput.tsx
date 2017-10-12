import * as React from 'react';
import { ValidationErrors } from '../../components';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

const styles = theme => ({
  error: {
    '&:after': {
      height: '1px',
    },
  },
});

export interface ITextInputProps {
  label: string;
  value: string;
  showErrors: boolean;
  errors: string[];
  onChange?: (event) => void;
  onBlur?: (event) => void;
  classes?: any;
}

function InputComponent({label, value, showErrors, errors, onChange, onBlur, classes}: ITextInputProps) {
  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor={label}>{label}</InputLabel>
        <Input
          id={label}
          value={value}
          onChange={onChange}
          classes={{
            error: classes.error,
          }}
          error={showErrors && errors.length > 0}
          margin="dense"
          onBlur={onBlur}
        />
      </FormControl>
      <ValidationErrors
        showErrors={showErrors}
        errors={errors}
      />
    </div>
  );
};

export const TextInput = withStyles(styles)<ITextInputProps>(InputComponent);
