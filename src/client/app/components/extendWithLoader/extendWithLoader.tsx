import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { IAppState, ILoadingState } from 'reducers';
import { Loader } from 'components/loader';

import { styles } from './styles';
import { GLOBAL_LOADER_ID, CONTENT_LOADER_ID } from 'client-utils';

interface IExtendWithLoaderProps extends Partial<WithStyles<typeof styles>> {
  loaderId?: 'content' | 'dialog' | 'global';
  showLoadingOverlay?: boolean;
  loadingState?: ILoadingState;
  isLoading?: boolean;
}

export function extendWithLoader<TOriginalProps extends {}>(
    WrappedComponent: React.ComponentType<TOriginalProps>
  ): React.ComponentType<TOriginalProps & IExtendWithLoaderProps> {

    type ResultProps = TOriginalProps & IExtendWithLoaderProps;
    class LoaderComponent extends React.Component<ResultProps> {

      render() {
        const { loadingState, showLoadingOverlay, classes } = this.props;
        const loaderId = this.props.loaderId || 'content';
        const isLoading = loadingState[loaderId] && !loadingState[GLOBAL_LOADER_ID];

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
        loadingState: state.loader
      };
    }

    // @ts-ignore
    const styledComponent = withStyles(styles)(LoaderComponent);

    return connect<{}, {}, ResultProps>(mapStateToProps)(styledComponent);
}
