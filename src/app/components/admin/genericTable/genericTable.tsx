import * as React from 'react';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';

export const GenericTable = ({rows, columns}) => {
	return (
		<Table>
			<TableHeader
				adjustForCheckbox={false}
				displaySelectAll={false}
			>
				<TableRow>
					{
						Object.keys(columns).map(columnKey => {
							const column = columns[columnKey];
							const label = typeof column === 'object' ? column.label : column;
							return (
								<TableHeaderColumn key={columnKey}>{label}</TableHeaderColumn>
							);
						})
					}
					<TableHeaderColumn>Actions</TableHeaderColumn>
				</TableRow>	
			</TableHeader>
			<TableBody displayRowCheckbox={false}>
				{
						Object.keys(rows).map(rowId => {
							const row = rows[rowId];
							return (
								<TableRow key={rowId}>
									{
										Object.keys(columns).map(columnId => {
											const column = columns[columnId];
											const rowColumn = column.accessor ? column.accessor(row[columnId]) : row[columnId];
											return (
												<TableRowColumn key={columnId}>{rowColumn}</TableRowColumn>
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
