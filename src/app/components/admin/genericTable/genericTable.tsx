import * as React from 'react';
import * as autoBind from 'react-autobind';
// import { IGenericDataMap } from '../../../typeDefinitions';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';

export interface IGenericTableColumn {
	title: string;
	dataProp?: string;
	sortable?: boolean;
	format?: any;
}

export class GenericTable extends React.Component<any, any> {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	render() {

		const { columns, dataMap } = this.props;

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
						</TableRow>	
					</TableHeader>
					<TableBody displayRowCheckbox={false}>
						{
							this.props.pageData.map((id, i) => {
								const row = dataMap[id];
								return (
									<TableRow key={i}>
										{
											columns.map((colItem, index) => {
												const column = colItem.dataProp ? row[colItem.dataProp] : '';
												const formattedColumn = colItem.format ? colItem.format(column) : column;
												return (
													<TableRowColumn key={index}>{formattedColumn}</TableRowColumn>
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
