import * as React from 'react';
import * as autoBind from 'react-autobind';
import { IGenericDataMap } from '../../../typeDefinitions';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
	TableFooter,
} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

export interface IGenericTableColumn {
	title: string;
	dataProp: string;
	sortable?: boolean;
	format?: any;
}

export interface IGenericTableProps {
	dataMap: IGenericDataMap<object>;
	columns: IGenericTableColumn[];
	limit?: number;
}

export class GenericTable extends React.Component<IGenericTableProps, any> {

	constructor(props: IGenericTableProps) {
		super(props);
		autoBind(this);
		const allData = Object.keys(props.dataMap);
		this.state = {
			offset: 0,
			limit: props.limit,
			pageData: allData.slice(0, this.props.limit),
			currentPage: 1,
			pages: Math.round(allData.length / props.limit),
			allData,
		};
	}

	paginate = (nextPage) => {
		const { allData, limit } = this.state;
		const offset = nextPage * limit - limit;
		this.setState({
			pageData: allData.slice(offset, offset + limit),
			currentPage: nextPage,
		});
	}

	getPageNumber(total) {
		const { currentPage, limit } = this.state;
		const topLimit = currentPage * limit;
		return `${topLimit - limit + 1} - ${topLimit <= total ? topLimit : total} of ${total}`;
	}

	getPaginationLinks(pageCount) {
		return (
			<ul>
				{
					[...Array(pageCount)].map((_, i) => {
						return (
							<li
								onClick={this.paginate.bind(this, i + 1)}
								key={i}
							>
								{i + 1}
							</li>
						);
					})
				}
			</ul>
		);
	}

	render() {

		const { columns, dataMap } = this.props;
		const { pages, currentPage } = this.state;
		const total = this.state.allData.length;

		return (
			<div>
				<Table>
					<TableHeader
						adjustForCheckbox={false}
						displaySelectAll={false}
					>
						<TableRow>
							{
								columns.map((column, index) => {
									return (<TableHeaderColumn key={index}>{column.title}</TableHeaderColumn>);
								})
							}
							<TableHeaderColumn>Actions</TableHeaderColumn>
						</TableRow>	
					</TableHeader>
					<TableBody displayRowCheckbox={false}>
						{
							this.state.pageData.map((id, i) => {
								const row = dataMap[id];
								return (
									<TableRow key={i}>
										{
											columns.map((colItem, index) => {
												const column = row[colItem.dataProp];
												const formattedColumn = colItem.format ? colItem.format(column) : column;
												return (
													<TableRowColumn key={index}>{formattedColumn}</TableRowColumn>
												);
											})
										}
										<TableRowColumn>Actions</TableRowColumn>
									</TableRow>
								);
							})
						}
					</TableBody>
				</Table>
				<div>
					<IconButton
						disabled={currentPage === 0}
						onClick={this.paginate.bind(this, currentPage - 1)}
					>
						<ChevronLeft />
					</IconButton>
					{this.getPaginationLinks(pages)}
					<IconButton
						disabled={currentPage + 1 > pages}
						onClick={this.paginate.bind(this, currentPage + 1)}
					>
						<ChevronRight />
					</IconButton>
				</div>
					<div style={{textAlign: 'right'}}>
						{this.getPageNumber(total)}
					</div>
			</div>
		);
	}
};
