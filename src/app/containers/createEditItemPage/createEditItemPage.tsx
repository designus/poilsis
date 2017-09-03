import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../reducers';
import { getItem, putItem } from '../../actions';
import { AddItem, extendWithForm, extendWithLoader } from '../../components';
import { itemModel } from '../../containers';
import { getFormStateWithData, getInitialFormState, ITEM_LOADER_ID } from '../../helpers';

const EditItemForm = extendWithLoader(extendWithForm(AddItem));

class CreateEditItemPageComponent extends React.Component<any, any> {

	state = getInitialFormState(itemModel);
	isCreatePage = !Boolean(this.props.params.id);

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.dispatch(getItem(ITEM_LOADER_ID, this.props.params.id));
	}

	getBackendErrors(errors) {
		return Object.keys(errors).reduce((acc, key) => {
			acc[key] = [errors[key].message];
			return acc;
		}, {});
	}

	onItemSubmit = (item) => {
		if (this.isCreatePage) {
			this.setState(getInitialFormState(itemModel));
		} else {
			this.props.dispatch(putItem(ITEM_LOADER_ID, item)).then((errors) => {
				if (errors) {
					const newErrors = {...this.state.errors, ...this.getBackendErrors(errors)};
					this.setState({errors: newErrors, showErrors: true});
				}
			});
		}

	}

	render() {

		const loadedItem = this.props.itemsMap[this.props.params.id];
		const finalState = loadedItem && getFormStateWithData(loadedItem, this.state) || this.state;

		if (loadedItem || this.isCreatePage) {

			return (
				<EditItemForm
					loaderId={ITEM_LOADER_ID}
					onItemSubmit={this.onItemSubmit}
					initialState={finalState}
					citiesMap={this.props.citiesMap}
					typesMap={this.props.typesMap}
				/>
			);
		} else {
			return null;
		}
	}
};

const mapStateToProps = (state: IAppState) => {
	return {
		itemsMap: state.items.dataMap,
		citiesMap: state.cities.dataMap,
		typesMap: state.types.dataMap,
	};
};

export const CreateEditItemPage = connect(mapStateToProps)(CreateEditItemPageComponent);
