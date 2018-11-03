import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import { WithStyles } from '@material-ui/core';
import { debounce } from 'lodash';

import { LANGUAGES, DEFAULT_LANGUAGE, hasLocalizedFields } from 'global-utils';
import { styles } from './styles';

export interface ITextInputProps extends WrappedFieldProps, WithStyles<typeof styles> {
  intl: boolean;
  selectedLanguage: string;
}

// TODO: Memoize this fn
const getInitialValue = (value, isIntl: boolean) => {
  if (isIntl) {
    return value ? value : LANGUAGES.reduce((acc, lang) => ({...acc, [lang]: ''}), {});
  }

  return value;
};

class InputComponent extends React.PureComponent<ITextInputProps, any> {

  initialValue = getInitialValue(this.props.input.value, this.props.intl);
  hasLocalizedFields = hasLocalizedFields(this.initialValue);

  constructor(props: ITextInputProps) {
    super(props);
    this.state = {
      value: this.initialValue,
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

  showError = (language: string) => {
    const { meta, selectedLanguage } = this.props;
    const hasError = Boolean(meta.touched && meta.invalid && meta.error);
    if (language) {
      return hasError && selectedLanguage === DEFAULT_LANGUAGE && language === DEFAULT_LANGUAGE;
    }
    return hasError;
  }

  renderInput = (value: string, language?: string) => {
    const { classes, label, meta, selectedLanguage } = this.props;
    return (
      <div
        className={`${classes.wrapper} ${language !== selectedLanguage ? classes.hidden : ''}`}
        key={language}
      >
        <Tooltip open={this.showError(language)} title={meta.error || ''} placement="right-end">
          <FormControl className={classes.formControl} error={this.showError(language)}>
            <InputLabel htmlFor={label}>
              {label}
            </InputLabel>
            <Input
              id={this.props.label}
              value={value}
              onChange={this.handleChange(language)}
              margin="dense"
              classes={{
                error: this.props.classes.error,
              }}
            />
          </FormControl>
        </Tooltip>
      </div>
    );
  }

  renderIntlInputs = () => LANGUAGES.map(lang => this.renderInput(this.state.value[lang], lang));

  render() {
    return this.props.intl && this.hasLocalizedFields
      ? this.renderIntlInputs()
      : this.renderInput(this.state.value);
  }
}

export const TextInput = withStyles(styles)(InputComponent) as any;
