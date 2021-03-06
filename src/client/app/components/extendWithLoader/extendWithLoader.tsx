import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { ILoadingState, IAppState, LoaderType } from 'types';
import { Loader } from 'components/loader';

import { styles } from './styles';

interface IExtendWithLoaderProps extends Partial<WithStyles<typeof styles>> {
  loaderId?: LoaderType;
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
        // @ts-ignore
        const isLoading = loadingState && loadingState[loaderId];

        return (
          <div className={classes?.wrapper}>
            <Loader isLoading={Boolean(isLoading)} showLoadingOverlay={showLoadingOverlay} />
            <WrappedComponent {...this.props} />
          </div>
        );
      }
    }

    const mapStateToProps = (state: IAppState) => {
      return {
        loadingState: state.loader
      };
    };

    // @ts-ignore
    const styledComponent = withStyles(styles)(LoaderComponent);

    return connect<{}, {}, ResultProps, IAppState>(mapStateToProps)(styledComponent);
}
