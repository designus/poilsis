import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { LANGUAGES, DEFAULT_LANGUAGE } from 'global-utils';
import Switch from '@material-ui/core/Switch';

import { styles } from './styles';

export interface ISwitchProps extends WrappedFieldProps, WithStyles<typeof styles> {
  isHidden: boolean;
  selectedLanguage: string;
  hasIntl: boolean;
}

class SwitcherComponent extends React.PureComponent<ISwitchProps, any> {

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    if (this.props.hasIntl) {
      this.props.input.onChange({ ...this.props.input.value, [this.props.selectedLanguage]: isChecked });
    } else {
      this.props.input.onChange(isChecked);
    }
  }

  renderInput = (value: boolean, lang?: string) => {
    const { classes, label, isHidden, selectedLanguage } = this.props;
    return (
      <div
        className={`${classes.wrapper} ${isHidden || lang !== selectedLanguage ? classes.hidden : ''}`}
        key={lang}
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
