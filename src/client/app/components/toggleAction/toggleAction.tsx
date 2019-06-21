import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { styles } from './styles';

export interface IToggleActionProps extends WithStyles<typeof styles> {
  isEnabled: boolean;
  onToggle: () => void;
}

class ToggleActionComponent extends React.PureComponent<IToggleActionProps, any> {

  render() {
    const { classes, isEnabled, onToggle} = this.props;
    return (
      <a
        className={`${classes.button} ${isEnabled ? classes.green : classes.red}`}
        onClick={onToggle}>
          {isEnabled ? <CheckIcon className={classes.icon} /> : <CloseIcon className={classes.icon} />}
      </a>
    );
  }
}

export const ToggleAction = withStyles(styles)(ToggleActionComponent);
