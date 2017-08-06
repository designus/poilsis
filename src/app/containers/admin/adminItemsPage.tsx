import * as React from 'react';
import {IAppState} from '../../reducers';
import {connect} from 'react-redux';
import { asyncConnect} from 'redux-connect';
import { fetchItems } from '../../actions/items';
import { GenericTable } from '../../components';
import {ItemTypesList} from '../../components/itemTypesList';

@asyncConnect([{
	key: 'items',
	promise: ({params, store}) => {

		const appState: IAppState = store.getState();
		const itemsState = appState.items;

		if (itemsState.allItemsLoaded) {
			return Promise.resolve();
		} else {
			return store.dispatch(fetchItems());
		}
	},
}])
class AdminItemsPageComponent extends React.Component<any, any> {
	render() {
		const columns = {
			id: 'ID',
			name: 'Name',
			city: {
				label: 'City',
				accessor: function(dataMap, cityId) {
					return dataMap[cityId].name;
				}.bind(null, this.props.citiesMap),
			},
			types: {
				label: 'Types',
				accessor: function(dataMap, types) {
					return (
						<ItemTypesList typeIds={types} typesMap={dataMap} />
					);
				}.bind(null, this.props.typesMap),
			},
			createdAt: 'Created at',
		};
		return (
			<div>
				<GenericTable
					rows={this.props.itemsMap}
					columns={columns}
				/>
			</div>
		);

	};
};

const mapStateToProps = (state: IAppState) => {
	return {
		itemsMap: state.items.dataMap,
		citiesMap: state.cities.dataMap,
		typesMap: state.types.dataMap,
	};
};

export const AdminItemsPage = connect(mapStateToProps)(AdminItemsPageComponent);
