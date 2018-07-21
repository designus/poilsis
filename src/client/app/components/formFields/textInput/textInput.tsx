import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import { WithStyles } from '@material-ui/core';
import { debounce } from 'lodash';

import { styles } from './styles';

export interface ITextInputProps extends WrappedFieldProps, WithStyles<typeof styles> {}

class InputComponent extends React.PureComponent<ITextInputProps, any> {
  constructor(props: ITextInputProps) {
    super(props);
    this.state = {
      value: '',
    };
  }

  static getDerivedStateFromProps(nextProps: ITextInputProps) {
    if (nextProps.input.value) {
      return {
        value: nextProps.input.value,
      };
    }
    return null;
  }

  handleChange = (event) => {
    const value = event.target.value;
    this.setState({ value });
    this.onChange(value);
  }

  updateStoreValue = (value) => {
    this.props.input.onChange(value);
  }

  onChange = debounce(this.updateStoreValue, 600);

  render() {
    const { classes, label, meta } = this.props;
    const showError = Boolean(meta.touched && meta.invalid && meta.error);
    return (
      <div className={classes.wrapper}>
        <Tooltip open={showError} title={meta.error || ''} placement="right-end">
          <FormControl className={classes.formControl} error={showError}>
            <InputLabel htmlFor={label}>
              {label}
            </InputLabel>
            <Input
              id={label}
              value={this.state.value}
              onChange={this.handleChange}
              classes={{
                error: classes.error,
              }}
              margin="dense"
            />
          </FormControl>
        </Tooltip>
      </div>
    );
  }
}

export const TextInput = withStyles(styles)(InputComponent) as any;
