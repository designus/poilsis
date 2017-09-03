import * as React from 'react';
import { CircularProgress } from 'material-ui/Progress';
import { connect } from 'react-redux';
import { IAppState } from '../../reducers';

export interface ILoaderProps {
	loaderId: string;
	showWrappedComponent: boolean;
}

export function extendWithLoader(
		WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>,
	): React.ComponentClass<any> {
		function LoaderComponent(props) {

			const {loaderId, loader } = props;
			const loaderState = loader[loaderId];
			const {isLoading} = loaderState;

			if (isLoading) {
				return (
					<CircularProgress />
				);
			}

			return (
				<WrappedComponent {...props} />
			);
		}

		function mapStateToProps(state: IAppState) {
			return {
				loader: state.loader,
			};
		}

		return connect(mapStateToProps)(LoaderComponent);
};
