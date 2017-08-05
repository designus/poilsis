import * as React from 'react';
import {IAppState} from '../../reducers';
import {connect} from 'react-redux';

class AdminItemsPageComponent extends React.Component<any, any> {
	render() {
		return (
			<div>Hello this is AdminItemsPageComponent</div>
		);
	};
};

const mapStateToProps = (state: IAppState) => {
	return {
		citiesMap: state.cities.dataMap,
		typesMap: state.types.dataMap,
	};
};

export const AdminItemsPage = connect(mapStateToProps)(AdminItemsPageComponent);
