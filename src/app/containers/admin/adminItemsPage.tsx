import * as React from 'react';
import {IAppState} from '../../reducers';
import {connect} from 'react-redux';
import { asyncConnect} from 'redux-connect';
import { fetchItems } from '../../actions/items';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';

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
		return (
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeaderColumn>ID</TableHeaderColumn>
						<TableHeaderColumn>Name</TableHeaderColumn>
						<TableHeaderColumn>City</TableHeaderColumn>
						<TableHeaderColumn>Types</TableHeaderColumn>
						<TableHeaderColumn>Created At</TableHeaderColumn>
						<TableHeaderColumn>Actions</TableHeaderColumn>
					</TableRow>	
				</TableHeader>
				<TableBody>
					{
						Object.keys(this.props.itemsMap).map(itemId => {
							const item = this.props.itemsMap[itemId];
							const city = this.props.citiesMap[item.city];
							return (
								<TableRow>
									<TableRowColumn>{item.id}</TableRowColumn>
									<TableRowColumn>{item.name}</TableRowColumn>
									<TableRowColumn>{city.name}</TableRowColumn>
									<TableRowColumn>{item.types}</TableRowColumn>
									<TableRowColumn>{item.createdAt}</TableRowColumn>
									<TableRowColumn>Actions</TableRowColumn>
								</TableRow>
							);
						})
					}
				</TableBody>
			</Table>
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
