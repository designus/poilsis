import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../reducers';
import { fetchItem } from '../../actions';

class AdminItemsEditPageComponent extends React.Component<any, any> {

	componentDidMount() {
		this.props.dispatch(fetchItem(this.props.params.id));
	}

	render() {
		console.log('Item', this.props.itemsMap[this.props.params.id]);
		return (
			<div>
				hi
			</div>
		);
	}
};

const mapStateToProps = (state: IAppState) => {
	return {
		itemsMap: state.items.dataMap,
	};
};

export const AdminItemsEditPage = connect(mapStateToProps)(AdminItemsEditPageComponent);
