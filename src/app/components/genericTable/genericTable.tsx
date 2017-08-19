import * as React from 'react';
import * as autoBind from 'react-autobind';
// import { IGenericDataMap } from '../../../typeDefinitions';

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

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
					<TableHead>
						<TableRow>
							{
								columns.map((column, index) => {
									return (<TableCell key={index}>{column.title}</TableCell>);
								})
							}
						</TableRow>	
					</TableHead>
					<TableBody>
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
