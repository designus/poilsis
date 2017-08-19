import * as React from 'react';
import * as autoBind from 'react-autobind';
import { IGenericDataMap } from '../../helpers';

import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';

export type SortType = 'string'|'number'|'date';
export type OrderType = 'asc'|'desc';

export interface IGenericTableColumn {
	title: string;
	dataProp?: string;
	sortType?: SortType;
	format?: any;
}

export class GenericTable extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);

		this.state = {
			order: props.order || 'asc',
			orderBy: null,
			allData: Object.keys(props.dataMap),
		};
	}

	sortData = (dataMap: IGenericDataMap<object>, order: OrderType, orderBy: string, sortType: SortType) => (a, b) => {
		let comparison = 0;
		const x = dataMap[a][orderBy].toLowerCase();
		const y = dataMap[b][orderBy].toLowerCase();

		if (x > y) {
			comparison = 1;
		} else if (x < y) {
			comparison = -1;
		}

		return comparison * (order === 'desc' ? -1 : 1);
	}

	handleSort(prop: string, sortType: SortType) {
		const orderBy = prop;
		const order = this.state.orderBy === prop && this.state.order === 'desc' ? 'asc' : 'desc';
		const data = [...this.state.allData].sort(this.sortData(this.props.dataMap, order, orderBy, sortType));
		this.setState({order, orderBy});
		this.props.handleNewData(data);
	}

	render() {
		const { columns, dataMap, pageData } = this.props;
		const { order, orderBy } = this.state;

		return (
			<div>
				<Table>
					<TableHead>
						<TableRow>
							{
								columns.map((column: IGenericTableColumn, index) => {
									return (
										<TableCell key={index}>
											{
												column.sortType ?
													<TableSortLabel
														active={orderBy === column.dataProp}
														direction={order}
														onClick={this.handleSort.bind(this, column.dataProp, column.sortType)}
													>
														{column.title}
													</TableSortLabel> :
													column.title
											}
										</TableCell>
									);
								})
							}
						</TableRow>	
					</TableHead>
					<TableBody>
						{
							pageData.map((id, i) => {
								const row = dataMap[id];
								return (
									<TableRow key={i}>
										{
											columns.map((colItem, index) => {
												const column = colItem.dataProp ? row[colItem.dataProp] : '';
												const formattedColumn = colItem.format ? colItem.format(column) : column;
												return (
													<TableCell key={index}>{formattedColumn}</TableCell>
												);
											})
										}
									</TableRow>
								);
							})
						}
					</TableBody>
				</Table>
			</div>
		);
	}
};
