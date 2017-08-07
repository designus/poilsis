import * as React from 'react';
import { IGenericDataMap } from '../../../typeDefinitions';
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
	dataProp: string;
	sortable?: boolean;
	format?: any;
}

export interface IGenericTableProps {
	data: IGenericDataMap<object>;
	columns: IGenericTableColumn[];
}

export const GenericTable = ({data, columns}: IGenericTableProps) => {
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
					Object.keys(data).map(rowId => {
						const row = data[rowId];
						return (
							<TableRow key={rowId}>
								{
									columns.map((columnObj, index) => {
										const column = row[columnObj.dataProp];
										const formattedColumn = columnObj.format ? columnObj.format(column) : column;
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
	);
};
