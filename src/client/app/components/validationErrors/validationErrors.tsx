import * as React from 'react';
import { WithStyles } from '@material-ui/core';
import { styles } from './styles';
import { withStyles } from '@material-ui/core/styles';

export interface IValidationErrors extends WithStyles<typeof styles> {
  error: string;
  showError: boolean;
}

const Errors = ({error, showError, classes}: IValidationErrors) => {
  return showError && error ? (
    <div className={classes.wrapper}>
      {error}
    </div>
  ) : null;
};

export const ValidationErrors = withStyles(styles)(Errors);
