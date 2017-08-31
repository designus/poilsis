import * as React from 'react';
import * as moment from 'moment';
import { IAppState } from '../../reducers';
import { connect } from 'react-redux';
import { asyncConnect} from 'redux-connect';
import { getItems } from '../../actions/items';
import { GenericTable, IGenericTableColumn, ItemTypesList, withPagination } from '../../components';
import { Link } from 'react-router';

const PaginatedTable = withPagination(GenericTable);

@asyncConnect([{
	key: 'items',
	promise: ({params, store}) => {

		const appState: IAppState = store.getState();
		const itemsState = appState.items;

		if (itemsState.allItemsLoaded) {
			return Promise.resolve();
		} else {
			return store.dispatch(getItems());
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
				sortType: 'string',
			},
			{
				title: 'City',
				dataProp: 'city',
				sortType: 'string',
				format: (cityId: string) => this.props.citiesMap[cityId].name,
			},
			{
				title: 'Types',
				dataProp: 'types',
				format: (types: string[]) => {
					return (
						<ItemTypesList
							typeIds={types}
							typesMap={this.props.typesMap}
						/>
					);
				},
			},
			{
				title: 'Created at',
				dataProp: 'createdAt',
				sortType: 'date',
				format: (date: string) => moment(date).format('YYYY-MM-DD'),
			},
			{
				title: 'Actions',
				dataProp: 'id',
				format: (id) => {
					return (
						<div>
							<Link	to={`/admin/items/edit/${id}`}>Edit</Link>
							<div onClick={this.onDelete.bind(null, id)}>Delete action</div>
						</div>
					);
				},
			},
		];
	}

	onEdit(id) {
		console.log('Open edit', id);
	}

	onDelete(id) {
		console.log('Open delete', id);
	}

	render() {
		return (
			<PaginatedTable
				dataMap={this.props.itemsMap}
				columns={this.columns}
				limit={5}
			/>
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
