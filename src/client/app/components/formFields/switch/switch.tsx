import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { LANGUAGES, DEFAULT_LANGUAGE } from 'global-utils';
import Switch from '@material-ui/core/Switch';
import { isInputHidden } from 'client-utils/methods';

import { styles } from './styles';

export interface ISwitchProps extends WrappedFieldProps, WithStyles<typeof styles> {
  selectedLanguage: string;
  hasIntl: boolean;
}

class SwitcherComponent extends React.PureComponent<ISwitchProps, any> {

  getIntlValue = (value: boolean) => {
    return LANGUAGES.reduce((acc, lang) => {
      acc[lang] = lang === this.props.selectedLanguage
        ? value
        : this.props.input.value[lang] || false;
      return acc;
    }, {});
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    if (this.props.hasIntl) {
      this.props.input.onChange(this.getIntlValue(isChecked));
    } else {
      this.props.input.onChange(isChecked);
    }
  }

  renderInput = (value: boolean, languageOption?: string) => {
    const { classes, label, selectedLanguage } = this.props;
    return (
      <div
        className={`
          ${classes.wrapper}
          ${isInputHidden(languageOption, this.props.selectedLanguage, this.props.hasIntl) ? classes.hidden : ''}
        `}
        key={languageOption}
      >
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(value)}
              onChange={this.handleChange}
            />
          }
          label={label}
        />
      </div>
    );
  }

  renderIntlInputs = () => LANGUAGES.map(lang => this.renderInput(this.props.input.value[lang], lang));

  render() {
    const { input, hasIntl } = this.props;
    return (
      <React.Fragment>
        {hasIntl ? this.renderIntlInputs() : this.renderInput(input.value)}
      </React.Fragment>
    );
  }
}

export const Switcher = withStyles(styles)(SwitcherComponent) as any;
