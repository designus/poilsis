import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { EnhancedTableHead } from './tableHead';

import { styles } from './styles';

export type SortType = 'string' | 'number' | 'date';
export type OrderType = 'asc' | 'desc';

export interface ITableColumn<T = any> {
  headerName: string;
  field: Partial<keyof T>;
  sortType?: SortType;
  searchable?: boolean;
  cellRenderer?: (data: T) => JSX.Element | string | number;
}

export interface ITableProps extends Partial<WithStyles<typeof styles>> {
  order?: OrderType;
  orderBy?: string;
  items?: any[];
  columns?: ITableColumn[];
  search?: string;
  limit?: number;
}

export interface ITableFilters {
  search: string;
}

type SearchableColumn = Pick<ITableColumn, 'field' | 'cellRenderer'>;

export interface ITableState {
  order: OrderType;
  orderBy: string;
  selected: string[];
  data: any[];
  page: number;
  rowsPerPage: number;
  filters: ITableFilters;
  searchableColumns: SearchableColumn[];
}

class EnhancedTable extends React.Component<ITableProps, ITableState> {

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
        search: props.search || ''
      },
      searchableColumns: this.getSearchableColumns(props.columns)
    };
  }

  componentWillReceiveProps(nextProps: ITableProps) {
    const data = nextProps.items;
    if (data !== this.state.data) {
      this.setState({ data });
    }

    if (nextProps.search !== this.state.filters.search) {
      this.handleSearch(nextProps.search);
    }
  }

  getSearchableColumns(columns: ITableColumn[]) {
    return columns
      .filter((column: ITableColumn) => column.searchable)
      .map((column: ITableColumn) => ({field: column.field, cellRenderer: column.cellRenderer}));
  }

  handleSearch(search: string) {
    const data = this.getFilteredData({search});
    this.setState({data, page: 0, order: null, orderBy: null});
  }

  getFilteredData(newFilters: ITableFilters) {

    const { filters } = this.state;
    const allFilters = newFilters ? {...filters, ...newFilters} : filters;

    return Object.keys(allFilters).reduce((filteredData, filter) => {
      if (filter === 'search' && allFilters[filter]) {
        return this.searchData(filteredData, allFilters[filter]);
      }
      return filteredData;
    }, this.props.items);
  }

  searchData(items: any[], search: string) {
    return items.filter(item => {
      return this.state.searchableColumns.some((column: SearchableColumn) => {
        const itemVal = item[column.field];
        const formattedItem = column.cellRenderer ? column.cellRenderer(itemVal) : itemVal;
        return formattedItem && formattedItem.search(new RegExp(search, 'i')) !== -1;
      });
    });
  }

  handleRequestSort = (event, property, sortType: SortType) => {
    const orderBy = property;
    const order: OrderType = this.state.orderBy === property && this.state.order === 'desc' ? 'asc' : 'desc';

    const data = this.state.data.sort((a, b) => {
      let comparison = 0;
      const x = a[orderBy].toLowerCase();
      const y = b[orderBy].toLowerCase();

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
        selected.slice(selectedIndex + 1)
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

  getColumnValue = (item: any, column: ITableColumn) =>
    typeof column.cellRenderer === 'function' ? column.cellRenderer(item) : item[column.field]

  render() {
    const { columns, classes, items: data } = this.props;
    const {
      order,
      orderBy,
      selected,
      rowsPerPage,
      page
    } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <div className={classes.wrapper}>
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
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any) => {
              const isSelected = this.isSelected(item.id);
              return item && (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={item.id}
                  selected={isSelected}
                >
                  <TableCell
                    padding="checkbox"
                    aria-checked={isSelected}
                    onClick={this.onSelectRow(item.id)}
                  >
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  {
                    columns.map((columnDef, index) => {
                      return (
                        <TableCell size="small" key={index}>
                          {this.getColumnValue(item, columnDef)}
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
      </div>
    );
  }
}

export default withStyles<any, any, ITableProps>(styles)(EnhancedTable);
