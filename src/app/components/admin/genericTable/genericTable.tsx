import * as React from 'react';
import * as autoBind from 'react-autobind';
import styled, { StyledFunction } from 'styled-components';
import { IGenericDataMap } from '../../../typeDefinitions';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
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

export const Pagination = styled.div`
	border-top: 1px solid #F0F0F0;
	padding: 10px;
	display: flex;
`;

export const PaginationNavigation = styled.div`
	flex: 3;
	display: flex;
	justify-content: left;
`;

export const PaginationLinks = styled.div`
	display: flex;
	align-items: center;

	ul {
		margin: 0;
		padding: 0;
	}	
`;

interface IPaginationLinkProps {
	isActive: boolean;
}

const li: StyledFunction<IPaginationLinkProps & React.HTMLProps<any>> = styled.li;

export const PaginationLink = li`
	display: inline-block;
	padding: 0 5px;
	list-style: none;
	& > span {
		cursor: pointer;
		background: ${props => props.isActive ? '#4286f4' : '#F0F0F0'};
		color: ${props => props.isActive ? '#fff' : '#1c1c1c'};
		padding: 3px 6px;
	}
`;

export const PaginationPageNumber = styled.div`
	flex: 1;
	text-align: right;
`;

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

	getPaginationLinks(pageCount: number, currentPage: number) {
		const pages = [...Array(pageCount)];
		return (
			<ul>
				{pages.map((_, i) => {
					return (
						<PaginationLink
							isActive={i + 1 === currentPage}
							onClick={this.paginate.bind(this, i + 1)}
							key={i}>
								<span>{i + 1}</span>
						</PaginationLink>
					);
				})}
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
				<Pagination>
					<PaginationNavigation>
						<IconButton
							disabled={currentPage === 1}
							onClick={this.paginate.bind(this, currentPage - 1)}
						>
							<ChevronLeft />
						</IconButton>
						<PaginationLinks>
							{this.getPaginationLinks(pages, currentPage)}
						</PaginationLinks>
						<IconButton
							disabled={currentPage + 1 > pages}
							onClick={this.paginate.bind(this, currentPage + 1)}
						>
							<ChevronRight />
						</IconButton>
					</PaginationNavigation>
					<PaginationPageNumber>
						{this.getPageNumber(total)}
					</PaginationPageNumber>
				</Pagination>
			</div>
		);
	}
};
