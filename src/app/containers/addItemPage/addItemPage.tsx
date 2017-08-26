import * as React from 'react';
import * as autoBind from 'react-autobind';
import * as Validators from '../../helpers/validation/validators';

import { connect } from 'react-redux';
import { AddItem, extendWithForm } from '../../components';
import { addNewItemState, postItem } from '../../actions';
import { IGenericFormState, TGenericFormModel, getKeyMap } from '../../helpers';

import {
	NAME_LABEL,
	CITY_LABEL,
	TYPES_LABEL,
	ADDRESS_LABEL,
	DESCRIPTION_LABEL,
} from '../../data-strings';

export interface INewItemFields {
	address?: string;
	city?: string;
	description?: string;
	name?: string;
	types?: string[];
}

export type TItemState = IGenericFormState<INewItemFields>;
export type TItemModel = TGenericFormModel<INewItemFields>;

export const itemModel: TItemModel = {
	name: getKeyMap('', NAME_LABEL, [Validators.required, Validators.minLength(6)]),
	city: getKeyMap('', CITY_LABEL, [Validators.required]),
	types: getKeyMap([], TYPES_LABEL, [Validators.required, Validators.minLength(1, true), Validators.maxLength(3, true)]),
	address: getKeyMap('', ADDRESS_LABEL, [Validators.required]),
	description: getKeyMap('', DESCRIPTION_LABEL, []),
};

const AddItemForm = extendWithForm(AddItem);

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
