import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core/styles';

import { styles } from './styles';

export interface ILoaderProps extends WithStyles<typeof styles> {
  isLoading: boolean;
  showLoadingOverlay: boolean;
}

export class Loader extends React.PureComponent<ILoaderProps> {
  static defaultProps = {
    showLoadingOverlay: false,
  };

  render() {
    const { classes, showLoadingOverlay, isLoading } = this.props;
    return (
      <div
        className={`
          loader
          ${classes.centeredLoader}
          ${showLoadingOverlay ? classes.overlay : ''}
          ${!isLoading ? classes.hidden : ''}
        `}
      >
        <div className={classes.round}>
          <CircularProgress size={30} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Loader);
