import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { styles } from './styles';

export interface IToggleActionProps extends WithStyles<typeof styles> {
  isEnabled: boolean;
}

class ToggleActionComponent extends React.PureComponent<IToggleActionProps, any> {
  render() {
    return this.props.isEnabled ? <CheckIcon /> : <CloseIcon />;
  }
}

export const ToggleAction = withStyles(styles)(ToggleActionComponent);
