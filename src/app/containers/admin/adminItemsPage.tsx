import * as React from 'react';
import {IAppState} from '../../reducers';
import {connect} from 'react-redux';
import { asyncConnect} from 'redux-connect';
import { fetchItems } from '../../actions/items';
import { GenericTable, IGenericTableColumn } from '../../components';
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

	get columns(): IGenericTableColumn[] {
		return [
			{
				title: 'Id',
				dataProp: 'id',
			},
			{
				title: 'Name',
				dataProp: 'name',
				sortable: true,
			},
			{
				title: 'City',
				dataProp: 'city',
				sortable: true,
				format: (cityId: string) => this.props.citiesMap[cityId].name,
			},
			{
				title: 'Types',
				dataProp: 'types',
				format: (types: string[]) => (<ItemTypesList typeIds={types} typesMap={this.props.typesMap} />),
			},
			{
				title: 'Created at',
				dataProp: 'createdAt',
			},
		];
	}

	render() {
		return (
			<div>
				<GenericTable
					dataMap={this.props.itemsMap}
					columns={this.columns}
					limit={5}
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
