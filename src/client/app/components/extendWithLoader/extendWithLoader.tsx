import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import { IAppState, ILoadingState } from 'reducers';
import { Loader } from 'components';

import { styles } from './styles';

interface IExtendWithLoaderProps extends Partial<WithStyles<typeof styles>> {
  loaderId: string;
  showLoadingOverlay?: boolean;
  loadingState?: ILoadingState;
  isLoading?: boolean;
}

export function extendWithLoader<TOriginalProps extends {}>(
    WrappedComponent: React.ComponentType<TOriginalProps>,
  ): React.ComponentType<TOriginalProps & IExtendWithLoaderProps> {

    type ResultProps = TOriginalProps & IExtendWithLoaderProps;
    class LoaderComponent extends React.Component<ResultProps> {

      render() {

        const { loaderId, loadingState, showLoadingOverlay, classes } = this.props;
        const isLoading = loadingState[loaderId];
        return (
          <div className={classes.wrapper}>
            <Loader isLoading={isLoading} showLoadingOverlay={showLoadingOverlay} />
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
