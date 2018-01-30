import * as React from 'react';
import * as autoBind from 'react-autobind';
import { IGenericDataMap } from '../../client-utils';
// import { MarkedText } from '../../components';

import Table, { TableBody, TableCell, TableHead, TableRow, TableSortLabel } from 'material-ui/Table';
import { PaginationInjectedProps } from '../pagination';

type SortType = 'string'|'number'|'date';
type OrderType = 'asc'|'desc';

export interface IGenericTableColumn {
  title: string;
  dataProp?: string;
  sortType?: SortType;
  searchable?: boolean;
  format?: any;
}

export interface IGenericTableProps {
  order?: OrderType;
  orderBy?: string;
  dataMap?: IGenericDataMap<object>;
  columns?: IGenericTableColumn[];
  search?: string;
}

export interface ISortParams {
  order: OrderType;
  orderBy: string;
  sortType: SortType;
  sortProp: string;
}

export class GenericTable extends React.Component<IGenericTableProps & PaginationInjectedProps, any> {

  constructor(props) {
    super(props);
    autoBind(this);

    const allData = Object.keys(props.dataMap);

    this.state = {
      order: props.order || null,
      orderBy: props.orderBy || null,
      allData,
      filteredData: allData,
      filters: {
        search: props.search || '',
      },
      searchableProps: this.getSearchableItemProps(props.columns),
    };
  }

  getSearchableItemProps(columns: IGenericTableColumn[]) {
    return columns
      .filter((column: IGenericTableColumn) => column.searchable)
      .map((column: IGenericTableColumn) => ({dataProp: column.dataProp, format: column.format}));
  }

  componentWillReceiveProps(nextProps: IGenericTableProps) {
    const newData = Object.keys(nextProps.dataMap);
    if (newData.length !== this.state.allData.length) {
      this.handleNewData(newData);
    }
    if (nextProps.search !== this.props.search) {
      this.handleSearch(nextProps.search);
    }
  }

  searchData(data: string[], search: string) {
    return data.filter(id => {
      const item = this.props.dataMap[id];
      return this.state.searchableProps.some(prop => {
        const itemVal = item[prop.dataProp];
        const formattedItem = prop.format ? prop.format(itemVal) : itemVal;
        return formattedItem && formattedItem.search(new RegExp(search, 'i')) !== -1;
      });
    });
  }

  getFilteredData(newData: string[], newFilters) {

    const {allData, filters} = this.state;
    const initialData = newData ? newData : [...allData];
    const allFilters = newFilters ? {...filters, ...newFilters} : filters;

    return Object.keys(allFilters).reduce((filteredData, filter) => {
      if (filter === 'search' && allFilters[filter]) {
        return this.searchData(filteredData, allFilters[filter]);
      }
      return filteredData;
    }, initialData);
  }

  getSortedData(data, sortParams: ISortParams|any) {
    return sortParams.order ? data.sort(this.sortData(sortParams)) : data;
  }

  handleSearch(search: string) {
    const filteredData = this.getSortedData(this.getFilteredData(null, {search}), this.state);

    this.setState({filteredData, filters: {...this.state.filters, search}});
    this.props.handleNewData(filteredData, true);
  }

  handleNewData(newData: string[]) {
    const filteredData = this.getSortedData(this.getFilteredData(newData, null), this.state);

    this.setState({filteredData, allData: newData});
    this.props.handleNewData(filteredData, false);
  }

  sortData = ({order, orderBy, sortType, sortProp}: ISortParams, dataMap: IGenericDataMap<object> = this.props.dataMap) =>
    (a, b) => {
      let comparison = 0;
      const x = dataMap[a][orderBy].toLowerCase();
      const y = dataMap[b][orderBy].toLowerCase();

      if (x > y) {
        comparison = 1;
      } else if (x < y) {
        comparison = -1;
      }

      return comparison * (order === 'desc' ? -1 : 1);
  }

  handleSort(sortProp: string, sortType: SortType) {
    const {allData, filteredData} = this.state;
    const order = !this.state.order ? 'asc' : this.state.order === 'asc' ? 'desc' : null;
    const orderBy = order ? sortProp : null;
    const dataCopy = [...(allData.length === filteredData.length && allData || filteredData)];
    const sortedData = this.getSortedData(dataCopy, {order, orderBy, sortType, sortProp});

    this.setState({order, orderBy, sortProp, sortType});
    this.props.handleNewData(sortedData);
  }

  render() {
    const { columns, dataMap, pageData = Object.keys(this.props.dataMap) } = this.props;
    const {
      order,
      orderBy,
      // filters: {search}
    } = this.state;
    return (
      <Table>
        <TableHead>
          <TableRow>
            {
              columns.map((column: IGenericTableColumn, index) => {
                return (
                  <TableCell key={index}>
                    {
                      column.sortType ?
                        <TableSortLabel
                          active={orderBy === column.dataProp}
                          direction={order}
                          onClick={this.handleSort.bind(this, column.dataProp, column.sortType)}
                        >
                          {column.title}
                        </TableSortLabel> :
                        column.title
                    }
                  </TableCell>
                );
              })
            }
          </TableRow>	
        </TableHead>
        <TableBody>
          {
            pageData.slice(0, 5).map((id, i) => {
              const row = dataMap[id] as any;
              if (row) {
                return (
                  <TableRow key={row.id}>
                    {
                      columns.map((colItem, index) => {
                        const column = colItem.dataProp ? row[colItem.dataProp] : '';
                        const formattedColumn = colItem.format ? colItem.format(column) : column;
                        return (
                          <TableCell key={index}>
                            {/* <MarkedText
                              fullText={formattedColumn}
                              markedText={search}
                            /> */}
                            {formattedColumn}
                          </TableCell>
                        );
                      })
                    }
                  </TableRow>
                );
              }
              return null;
            })
          }
        </TableBody>
      </Table>
    );
  }
};
