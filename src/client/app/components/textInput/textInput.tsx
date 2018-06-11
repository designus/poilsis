import * as React from 'react';
import { ValidationErrors } from '../../components';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { ERROR_COLOR, INPUT_WIDTH, INPUT_STYLE_MIXIN } from '../../global-styles';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 10px 0;
`;

const styles = theme => ({
  formControl: {
    width: INPUT_WIDTH,
  },
  error: {
    '&:after': {
      backgroundColor: ERROR_COLOR,
    },
  },
  ...INPUT_STYLE_MIXIN,
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
    <Wrapper>
      <FormControl className={classes.formControl} error={showErrors && errors.length > 0}>
        <InputLabel
          htmlFor={label}
        >
          {label}
        </InputLabel>
        <Input
          id={label}
          value={value}
          onChange={onChange}
          classes={{
            error: classes.error,
            underline: classes.underline,
            focused: classes.focused,
          }}
          margin="dense"
          onBlur={onBlur}
        />
      </FormControl>
      <ValidationErrors
        showErrors={showErrors}
        errors={errors}
      />
    </Wrapper>
  );
}

export const TextInput = withStyles(styles)<ITextInputProps>(InputComponent);
