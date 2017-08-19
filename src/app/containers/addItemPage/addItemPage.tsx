import * as React from 'react';
import * as autoBind from 'react-autobind';

import {connect} from 'react-redux';
import { AddItemForm } from '../../components';
import { addNewItemState, postItem } from '../../actions';

class AddItemPageComponent extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	onItemSubmit(item) {
		this.props.postItem(item);
	}

	onSaveState(state) {
		this.props.addNewItemState(state);
	}

	render() {
		return (
			<div>
				<h1>Pasiskelbkite</h1>
				<AddItemForm
					onSaveState={this.onSaveState}
					onItemSubmit={this.onItemSubmit}
					{...this.props}
				/>
			</div>
		);
	}
}

export const mapStateToProps = (state) => {
	return {
		initialState: state.newItem,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		addNewItemState: (state) => dispatch(addNewItemState(state)),
		postItem: (item) => dispatch(postItem(item)),
	};
};

export const AddItemPage = connect(mapStateToProps, mapDispatchToProps)(AddItemPageComponent);
