import * as React from 'react';
import {
  TableHead,
  TableSortLabel,
  TableRow,
  TableCell,
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import { ITableColumn, SortType, OrderType } from '../table';

interface ITableHead {
  numSelected: number;
  order: OrderType;
  orderBy: string;
  onSelectAllClick: (event, checked: boolean) => void;
  onRequestSort: (event, property: string, sortType: SortType) => void;
  rowCount: number;
  columns?: ITableColumn[];
}

export class EnhancedTableHead extends React.Component<ITableHead, any> {

  createSortHandler = (property, sortType) => event => {
    this.props.onRequestSort(event, property, sortType);
  }

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, columns } = this.props;

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
                // sortDirection={orderBy === column.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === column.dataProp}
                  direction={order}
                  onClick={this.createSortHandler(column.dataProp, column.sortType)}
                >
                  {column.title}
                </TableSortLabel>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}