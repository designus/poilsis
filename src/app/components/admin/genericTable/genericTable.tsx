import * as React from 'react';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';

export const GenericTable = ({data, columns}) => {
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
