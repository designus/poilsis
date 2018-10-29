import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import { IAppState, ILoadingState } from 'reducers';

import { styles } from './styles';

export interface ILoaderProps extends Partial<WithStyles<typeof styles>> {
  loaderId: string;
  showLoadingOverlay?: boolean;
  loadingState?: ILoadingState;
  isLoading?: boolean;
}

export function extendWithLoader<TOriginalProps extends {}>(
    WrappedComponent: React.ComponentType<TOriginalProps>,
  ): React.ComponentType<TOriginalProps & ILoaderProps> {

    type ResultProps = TOriginalProps & ILoaderProps;
    class LoaderComponent extends React.Component<ResultProps> {

      render() {

        const { loaderId, loadingState, showLoadingOverlay, classes } = this.props;
        const loader = loadingState[loaderId];
        const isLoading = loader && loader.isLoading;

        return (
          <div className={classes.wrapper}>
            <div className={`
              ${classes.centeredLoader}
              ${showLoadingOverlay ? classes.overlay : ''}
              ${!isLoading ? classes.hidden : ''}
              `}
            >
              <div className={classes.round}>
                <CircularProgress size={30} />
              </div>
            </div>
            <WrappedComponent {...this.props} />
          </div>
        );
      }
    }

    function mapStateToProps(state: IAppState) {
      return {
        loadingState: state.loader,
      };
    }

    // @ts-ignore
    const styledComponent = withStyles(styles)(LoaderComponent);

    return connect<{}, {}, ResultProps>(mapStateToProps)(styledComponent);
}
