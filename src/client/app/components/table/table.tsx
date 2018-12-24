import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import { IGenericDataMap } from '../../client-utils';
import styled from 'styled-components';
import { EnhancedTableHead } from './tableHead';

const TableWrapper = styled.div`
  margin-top: 20px;
`;

export type SortType = 'string' | 'number' | 'date';
export type OrderType = 'asc' | 'desc';

export interface ITableColumn {
  title: string;
  dataProp: string;
  formatProps?: string[];
  sortType?: SortType;
  searchable?: boolean;
  format?: any;
}

export interface ITableProps {
  order?: OrderType;
  orderBy?: string;
  dataMap?: IGenericDataMap<object>;
  items?: string[];
  columns?: ITableColumn[];
  search?: string;
  limit?: number;
  classes?: any;
}

export interface ITableFilters {
  search: string;
}

export interface ISearchableColumn {
  dataProp: string;
  format: any;
}

export interface ITableState {
  order: OrderType;
  orderBy: string;
  selected: string[];
  data: string[];
  page: number;
  rowsPerPage: number;
  filters: ITableFilters;
  searchableColumns: ISearchableColumn[];
}

export class EnhancedTable extends React.Component<ITableProps, any> {

  state: ITableState;

  constructor(props: ITableProps, context) {
    super(props, context);

    this.state = {
      order: props.order || null,
      orderBy: props.orderBy || null,
      selected: [],
      data: props.items,
      page: 0,
      rowsPerPage: props.limit,
      filters: {
        search: props.search || '',
      },
      searchableColumns: this.getSearchableColumns(props.columns),
    };
  }

  componentWillReceiveProps(nextProps: ITableProps) {
    const data = nextProps.items;
    if (data.length !== this.state.data.length) {
      this.setState({data});
    }
    if (nextProps.search !== this.state.filters.search) {
      this.handleSearch(nextProps.search);
    }
  }

  getSearchableColumns(columns: ITableColumn[]) {
    return columns
      .filter((column: ITableColumn) => column.searchable)
      .map((column: ITableColumn) => ({dataProp: column.dataProp, format: column.format}));
  }

  handleSearch(search: string) {
    const data = this.getFilteredData({search});
    this.setState({data, page: 0, order: null, orderBy: null});
  }

  getFilteredData(newFilters: ITableFilters) {

    const {filters} = this.state;
    const initialData = Object.keys(this.props.dataMap);
    const allFilters = newFilters ? {...filters, ...newFilters} : filters;

    return Object.keys(allFilters).reduce((filteredData, filter) => {
      if (filter === 'search' && allFilters[filter]) {
        return this.searchData(filteredData, allFilters[filter]);
      }
      return filteredData;
    }, initialData);
  }

  searchData(data: string[], search: string) {
    return data.filter(id => {
      const item = this.props.dataMap[id];
      return this.state.searchableColumns.some((column: ISearchableColumn) => {
        const itemVal = item[column.dataProp];
        const formattedItem = column.format ? column.format(itemVal) : itemVal;
        return formattedItem && formattedItem.search(new RegExp(search, 'i')) !== -1;
      });
    });
  }

  handleRequestSort = (event, property, sortType: SortType) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data = this.state.data.sort((a, b) => {
      let comparison = 0;
      const x = this.props.dataMap[a][orderBy].toLowerCase();
      const y = this.props.dataMap[b][orderBy].toLowerCase();

      if (x > y) {
        comparison = 1;
      } else if (x < y) {
        comparison = -1;
      }

      return comparison * (order === 'desc' ? -1 : 1);
    });

    this.setState({ data, order, orderBy });
  }

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data });
      return;
    }
    this.setState({ selected: [] });
  }

  onSelectRow = (id) => (event) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  getColumnValue = (row, column: ITableColumn) => {
    const defaultValue = row[column.dataProp];
    if (column.format) {
      const args = column.formatProps ? column.formatProps.map(prop => row[prop]) : [defaultValue];
      return column.format(...args);
    } else {
      return defaultValue;
    }
  }

  render() {
    const { columns, dataMap } = this.props;
    const {
      data,
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
    } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <TableWrapper>
        <Table>
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={this.handleSelectAllClick}
            onRequestSort={this.handleRequestSort}
            rowCount={data.length}
            columns={columns}
          />
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(id => {
              const row = dataMap[id];
              const isSelected = this.isSelected(id);
              return row && (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={id}
                  selected={isSelected}
                >
                  <TableCell
                    padding="checkbox"
                    aria-checked={isSelected}
                    onClick={this.onSelectRow(id)}
                  >
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  {
                    columns.map((column, index) => {
                      return (
                        <TableCell padding="dense" key={index}>
                          {this.getColumnValue(row, column)}
                        </TableCell>
                      );
                    })
                  }
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={columns.length + 1} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableWrapper>
    );
  }
}
