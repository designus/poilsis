import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { WithStyles } from '@material-ui/core';

import { styles } from './styles';

export interface ISwitchProps extends WrappedFieldProps, WithStyles<typeof styles> {}

class SwitcherComponent extends React.PureComponent<ISwitchProps, any> {

  handleChange = (event) => {
    this.props.input.onChange(event.target.checked);
  }

  render() {
    const { classes, label, input } = this.props;
    return (
      <div className={classes.wrapper}>
        <FormControlLabel
          control={
            <Switch
              checked={input.value}
              onChange={this.handleChange}
            />
          }
          label={label}
        />
      </div>
    );
  }
}

export const Switcher = withStyles(styles)(SwitcherComponent) as any;
