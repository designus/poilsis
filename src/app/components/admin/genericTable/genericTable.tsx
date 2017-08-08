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
			allData,
		};
	}

	paginate = (offset, limit) => {
		const { allData } = this.state;
		this.setState({
			pageData: allData.slice(offset, offset + limit),
			offset,
		});
	}

	paginateBack = () => {
		const { offset, limit } = this.state;
		this.paginate(offset - limit, limit);
	}

	paginateForward = () => {
		const { offset, limit } = this.state;
		this.paginate(offset + limit, limit);
	}

	getPageNumber(total) {
		const { offset, limit } = this.state;
		return `${Math.min((offset + 1), total)} - ${Math.min((offset + limit), total)} of ${total}`;
	}

	render() {

		const { columns, dataMap } = this.props;
		const { offset, limit } = this.state;
		const total = this.state.allData.length;

		return (
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
				<TableFooter adjustForCheckbox={false}>
					<TableRow>
						<TableRowColumn>
							<div>
								<IconButton
									disabled={offset === 0}
									onClick={this.paginateBack}
								>
									<ChevronLeft />
								</IconButton>
								<IconButton
									disabled={offset + limit >= total}
									onClick={this.paginateForward}
								>
									<ChevronRight />
								</IconButton>
							</div>
						</TableRowColumn>
						<TableRowColumn>
							<div style={{textAlign: 'right'}}>
								{this.getPageNumber(total)}
							</div>
						</TableRowColumn>
					</TableRow>
				</TableFooter>
			</Table>
		);
	}
};
