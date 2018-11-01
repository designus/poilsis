import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import { WithStyles } from '@material-ui/core';
import { debounce } from 'lodash';

import { LANGUAGES } from 'global-utils';
import { styles } from './styles';

export interface ITextInputProps extends WrappedFieldProps, WithStyles<typeof styles> {
  intl: boolean;
}

// TODO: Memoize this fn
const getInitialValue = (value, isIntl: boolean) => {
  if (isIntl) {
    return value ? value : LANGUAGES.reduce((acc, lang) => ({...acc, [lang]: ''}), {});
  }

  return value;
};

class InputComponent extends React.PureComponent<ITextInputProps, any> {
  constructor(props: ITextInputProps) {
    super(props);
    this.state = {
      value: getInitialValue(props.input.value, props.intl),
    };
  }

  handleChange = lang => event => {
    const oldValue = this.state.value;
    const newValue = event.target.value;
    const newState = this.props.intl ? { ...oldValue, [lang]: newValue } : newValue;

    this.setState({ value: newState });
    this.onChange(newState);
  }

  updateStoreValue = (value) => {
    this.props.input.onChange(value);
  }

  onChange = debounce(this.updateStoreValue, 600);

  renderInput = (value: string, lang?: string, i?: number) => {
    const { classes, label, meta } = this.props;
    const showError = Boolean(meta.touched && meta.invalid && meta.error);
    return (
      <div className={classes.wrapper} key={i}>
        <Tooltip open={showError} title={meta.error || ''} placement="right-end">
          <FormControl className={classes.formControl} error={showError}>
            <InputLabel htmlFor={label}>
              {label}
            </InputLabel>
            <Input
              id={this.props.label}
              value={value}
              onChange={this.handleChange(lang)}
              margin="dense"
              className={lang ? lang : ''}
              classes={{
                error: this.props.classes.error,
              }}
            />
          </FormControl>
        </Tooltip>
      </div>
    );
  }

  renderIntlInputs = () => {
    return Object.keys(this.state.value).map((lang, i) =>
      this.renderInput(this.state.value[lang], lang, i),
    );
  }

  render() {
    return this.props.intl ?  this.renderIntlInputs() : this.renderInput(this.state.value);
  }
}

export const TextInput = withStyles(styles)(InputComponent) as any;
