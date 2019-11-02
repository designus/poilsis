import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { styles } from './styles';

export interface IToggleActionProps extends WithStyles<typeof styles> {
  isEnabled: boolean;
  onToggle: () => void;
  label?: string;
  isDisabled?: boolean;
  tooltipText?: string;
  showTooltip?: boolean;
}

const ToggleAction = (props: IToggleActionProps) => {
  const { classes, isEnabled, onToggle, label, isDisabled, tooltipText, showTooltip } = props;

  const renderIcons = () => isEnabled ? <CheckIcon className={classes.icon} /> : <CloseIcon className={classes.icon} />;

  const handleToggle = () => {
    if (!isDisabled) {
      onToggle();
    }
  };

  const renderButton = () => {
    return (
      <a
        className={`${classes.button} ${isEnabled ? classes.green : classes.red} ${isDisabled ? classes.disabled : ''}`}
        onClick={handleToggle}>
          {typeof label === 'string' ? label : renderIcons()}
      </a>
    );
  };

  const renderTooltip = () => {
    return (
      <Tooltip classes={{ tooltip: classes.tooltip }} title={tooltipText} placement="right">
        {renderButton()}
      </Tooltip>
    );
  };

  return showTooltip ? renderTooltip() : renderButton();
};

export default withStyles(styles)(ToggleAction);
