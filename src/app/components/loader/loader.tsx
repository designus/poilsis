import * as React from 'react';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from 'react-redux';
import { IAppState, ILoadingState } from '../../reducers';
import styled from 'styled-components';

const StyledLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export interface ILoaderProps {
  loaderId: string;
  loader?: ILoadingState;
}

export function extendWithLoader<TOriginalProps extends {}>(
    WrappedComponent: React.ComponentClass<TOriginalProps> | React.StatelessComponent<TOriginalProps>,
  ): React.ComponentClass<TOriginalProps & ILoaderProps> {

    type ResultProps = TOriginalProps & ILoaderProps;
    const LoaderComponent = class extends React.Component<ResultProps, {}> {

      render(): JSX.Element {
        const {loaderId, loader} = this.props;
        const loaderState = loader[loaderId];
        const isLoading = loaderState && loaderState.isLoading;

        return (
          <StyledLoader>
            {isLoading ?
              <CircularProgress /> :
              <WrappedComponent {...this.props} />}
          </StyledLoader>
        );
      }
    };

    function mapStateToProps(state: IAppState) {
      return {
        loader: state.loader,
      };
    }

    return connect<{}, {}, any>(mapStateToProps)(LoaderComponent);
};
