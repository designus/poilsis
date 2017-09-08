import * as React from 'react';
import * as autoBind from 'react-autobind';
import * as Validators from '../../helpers/validation/validators';

import { connect } from 'react-redux';
import { AddItem, extendWithForm } from '../../components';
import { addNewItemState, postItem, showBackendValidationErrors, clearFields } from '../../actions';
import { IGenericFormState, TGenericFormModel, getKeyMap, getMergedErrors } from '../../helpers';

import {
	NAME_LABEL,
	CITY_LABEL,
	TYPES_LABEL,
	ADDRESS_LABEL,
	DESCRIPTION_LABEL,
} from '../../data-strings';

export interface INewItemFields {
	id?: string;
	address?: string;
	city?: string;
	description?: string;
	name?: string;
	types?: string[];
}

export type TItemState = IGenericFormState<INewItemFields>;
export type TItemModel = TGenericFormModel<INewItemFields>;

export const itemModel: TItemModel = {
	id: getKeyMap('', 'id', []),
	name: getKeyMap('', NAME_LABEL, [Validators.required, Validators.minLength(6)]),
	city: getKeyMap('', CITY_LABEL, [Validators.required]),
	types: getKeyMap([], TYPES_LABEL, [Validators.required, Validators.minLength(1, true), Validators.maxLength(3, true)]),
	address: getKeyMap('', ADDRESS_LABEL, []),
	description: getKeyMap('', DESCRIPTION_LABEL, []),
};

const AddItemForm = extendWithForm(AddItem);
const ADD_ITEM_PAGE_LOADER = 'addItemPage';

class AddItemPageComponent extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	onItemSubmit(item) {
		this.props.postItem(item, ADD_ITEM_PAGE_LOADER).then((errors) => {
			if (errors) {
				const validationErrors = getMergedErrors(errors, this.props.initialState.errors);
				this.props.showBackendErrors(validationErrors);
			} else {
				this.props.clearFormFields();
			}
		});
	}

	onSaveState(state) {
		this.props.addNewItemState(state);
	}

	render() {
		return (
			<div>
				<h1>Post your ad</h1>
				<AddItemForm
					loaderId={ADD_ITEM_PAGE_LOADER}
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
		postItem: (item, loaderId) => dispatch(postItem(item, loaderId)),
		showBackendErrors: (errors) => dispatch(showBackendValidationErrors(errors)),
		clearFormFields: () => dispatch(clearFields()),
	};
};

export const AddItemPage = connect(mapStateToProps, mapDispatchToProps)(AddItemPageComponent);
