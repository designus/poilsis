import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../reducers';
import { fetchItem } from '../../actions';
import { AddItem, extendWithForm } from '../../components';
import { itemModel } from '../../containers';
import { getFormStateWithData, getInitialFormState } from '../../helpers';

const EditItemForm = extendWithForm(AddItem);

class CreateEditItemPageComponent extends React.Component<any, any> {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.dispatch(fetchItem(this.props.params.id));
	}

	onItemSubmit(item) {
		console.log('Submit...');
	}

	render() {

		const loadedItem = this.props.itemsMap[this.props.params.id];
		const isCreatePage = !Boolean(this.props.params.id);
		const emptyState = getInitialFormState(itemModel);
		const finalState = loadedItem && getFormStateWithData(loadedItem, emptyState) || emptyState;

		if (loadedItem || isCreatePage) {

			return (
				<EditItemForm
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
