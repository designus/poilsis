import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { styles } from './styles';

export interface IToggleActionProps extends WithStyles<typeof styles> {
  isEnabled: boolean;
  onToggle: () => void;
  label?: string;
}

const ToggleAction = (props: IToggleActionProps) => {
  const { classes, isEnabled, onToggle, label } = props;

  const renderIcons = () => isEnabled ? <CheckIcon className={classes.icon} /> : <CloseIcon className={classes.icon} />;

  return (
    <a
      className={`${classes.button} ${isEnabled ? classes.green : classes.red}`}
      onClick={onToggle}>
        {typeof label === 'string' ? label : renderIcons()}
    </a>
  );
};

export default withStyles(styles)(ToggleAction);
