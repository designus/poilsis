import * as React from 'react';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { ITableColumn, SortType, OrderType } from '../table';

interface ITableHead {
  numSelected: number;
  order: OrderType;
  orderBy: string;
  onSelectAllClick: (event: any, checked: boolean) => void;
  onRequestSort: (event: any, property: string, sortType: SortType) => void;
  rowCount: number;
  columns: ITableColumn[];
}

export class EnhancedTableHead extends React.Component<ITableHead, any> {

  createSortHandler = (property: any, sortType: any) => (event: any) => {
    this.props.onRequestSort(event, property, sortType);
  }

  render() {
    const {
      onSelectAllClick,
      // order,
      orderBy,
      numSelected,
      rowCount,
      columns
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columns.map((column: ITableColumn, index) => {
            return (
              <TableCell
                key={index}
                size="small"
                // sortDirection={orderBy === column.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === column.field}
                  // direction={order}
                  onClick={this.createSortHandler(column.field, column.sortType)}
                >
                  {column.headerName}
                </TableSortLabel>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}
