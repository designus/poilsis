import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { styles } from './styles';

export interface IToggleActionProps extends WithStyles<typeof styles> {
  isEnabled: boolean;
  toggle: (disable: boolean) => any;
}

class ToggleActionComponent extends React.PureComponent<IToggleActionProps, any> {
  render() {
    const { classes, isEnabled, toggle } = this.props;
    return (
      <a
        className={`${classes.button} ${isEnabled ? classes.green : classes.red}`}
        onClick={toggle(isEnabled)}>
          {isEnabled ? <CheckIcon className={classes.icon} /> : <CloseIcon className={classes.icon} />}
      </a>
    );
  }
}

export const ToggleAction = withStyles(styles)(ToggleActionComponent);
