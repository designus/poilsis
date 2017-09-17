import * as React from 'react';
import * as autoBind from 'react-autobind';
import { IGenericDataMap } from '../../helpers';
import { MarkedText } from '../../components';

import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';

export type SortType = 'string'|'number'|'date';
export type OrderType = 'asc'|'desc';

export interface IGenericTableColumn {
	title: string;
	dataProp?: string;
	sortType?: SortType;
	searchable?: boolean;
	format?: any;
}

export interface IGenericTableProps {
	order?: OrderType;
	orderBy?: string;
	dataMap?: IGenericDataMap<object>;
	pageData?: string[];
	columns?: IGenericTableColumn[];
	handleNewData?: (data: string[], goToFirstPage?: boolean) => void;
	search?: string;
}

export class GenericTable extends React.Component<IGenericTableProps, any> {

	constructor(props) {
		super(props);
		autoBind(this);

		const allData = Object.keys(props.dataMap);

		this.state = {
			search: props.search || '',
			order: props.order || null,
			orderBy: props.orderBy || null,
			allData,
			sortedData: allData,
			searchableProps: this.getSearchableItemProps(props.columns),
		};
	}

	getSearchableItemProps(columns: IGenericTableColumn[]) {
		return columns
			.filter((column: IGenericTableColumn) => column.searchable)
			.map((column: IGenericTableColumn) => ({dataProp: column.dataProp, format: column.format}));
	}

	componentWillReceiveProps(nextProps: IGenericTableProps) {
		if (nextProps.search !== this.props.search) {
			this.handleSearch(nextProps.search);
		}
	}

	searchData(data: string[], search: string) {
		return data.filter(id => {
			const item = this.props.dataMap[id];
			return this.state.searchableProps.some(prop => {
				const itemVal = item[prop.dataProp];
				const formattedItem = prop.format ? prop.format(itemVal) : itemVal;
				return formattedItem && formattedItem.search(new RegExp(search, 'i')) !== -1;
			});
		});
	}

	handleSearch(search: string) {
		const dataCopy = [...this.state.sortedData];
		const data = search ?
			this.searchData(dataCopy, search) :
			dataCopy;

		this.setState({search});
		this.props.handleNewData(data, true);
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
		let order;
		if (!this.state.order) {
			order = 'asc';
		} else if (this.state.order === 'asc') {
			order = 'desc';
		}
		const orderBy = order ? prop : null;
		const dataCopy = [...this.state.allData];
		const sortedData = order ?
			dataCopy.sort(this.sortData(this.props.dataMap, order, orderBy, sortType)) :
			dataCopy;

		this.setState({order, orderBy, sortedData});
		this.props.handleNewData(sortedData);
	}

	render() {
		const { columns, dataMap, pageData } = this.props;
		const { order, orderBy, search } = this.state;

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
													<TableCell key={index}>
														<MarkedText
															fullText={formattedColumn}
															markedText={search}
														/>
													</TableCell>
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
