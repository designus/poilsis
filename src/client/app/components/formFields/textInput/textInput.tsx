import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import { WithStyles } from '@material-ui/core/styles';
import { debounce } from 'lodash';

import { LANGUAGES, DEFAULT_LANGUAGE, hasLocalizedFields } from 'global-utils';
import { styles } from './styles';

export interface ITextInputProps extends WrappedFieldProps, WithStyles<typeof styles> {
  intl: boolean;
  selectedLanguage: string;
  multiline: boolean;
}

// TODO: Memoize this fn
const getInitialValue = (value, isIntl: boolean) => {
  if (isIntl) {
    const isLocalized = hasLocalizedFields(value);
    return LANGUAGES.reduce((acc, lang) => {
      // tslint:disable-next-line
      if (isLocalized) {
        acc[lang] = value[lang] || '';
      } else {
        acc[lang] = DEFAULT_LANGUAGE === lang ? value : '';
      }
      return acc;
    }, {});
  }

  return value;
};

class InputComponent extends React.Component<ITextInputProps, any> {

  initialValue = getInitialValue(this.props.input.value, this.props.intl);

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

  updateStoreValue = (value: string) => {
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
    const { classes, label, meta, selectedLanguage, multiline } = this.props;
    return (
      <div
        className={`${classes.wrapper} ${language !== selectedLanguage ? classes.hidden : ''}`}
        key={language}
      >
        <Tooltip open={this.showError(language)} title={meta.error || ''} placement="right-end">
          <FormControl
            className={`${classes.formControl} ${multiline ? classes.multiline : ''}`}
            error={this.showError(language)}
          >
            <InputLabel htmlFor={label}>
              {label}
            </InputLabel>
            <Input
              id={this.props.label}
              value={value}
              multiline={multiline}
              rows={4}
              onChange={this.handleChange(language)}
              margin="dense"
              className={`${multiline ? classes.multilineInput : ''}`}
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
    return this.props.intl
      ? this.renderIntlInputs()
      : this.renderInput(this.state.value);
  }
}

export const TextInput = withStyles(styles)(InputComponent) as any;
