import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { IAppState } from 'reducers';

const Wrapper = styled.div`
  position: relative;
`;

const CenteredLoader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  ${(props: any) => props.showLoadingOverlay ? 'background: rgba(255, 255, 255, .6); z-index: 1;' : ''}
  ${(props: any) => !props.isLoading ? 'display: none;' : ''}
  ` as any;

export interface ILoaderProps {
  showLoadingOverlay?: boolean;
  isLoading?: boolean;
}

export function extendWithLoader<TOriginalProps extends {}>(
    WrappedComponent: React.ComponentClass<TOriginalProps> | React.StatelessComponent<TOriginalProps>,
  ): React.ComponentClass<TOriginalProps & ILoaderProps> {

    type ResultProps = TOriginalProps & ILoaderProps;
    const LoaderComponent = class extends React.Component<ResultProps, {}> {

      render(): JSX.Element {

        const { isLoading, showLoadingOverlay} = this.props;

        return (
          <Wrapper>
            <CenteredLoader
              showLoadingOverlay={showLoadingOverlay}
              isLoading={isLoading}
            >
              <CircularProgress />
            </CenteredLoader>
            <WrappedComponent {...this.props} />
          </Wrapper>
        );
      }
    };

    function mapStateToProps(state: IAppState) {
      return {
        isLoading: state.isLoading,
      };
    }

    return connect<{}, {}, any>(mapStateToProps)(LoaderComponent);
}
