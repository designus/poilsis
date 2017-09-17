import * as React from 'react';
import * as moment from 'moment';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { asyncConnect} from 'redux-connect';
import { IAppState } from '../../reducers';
import { getItems } from '../../actions';
import { GenericTable, IGenericTableColumn, ItemTypesList, extendWithPagination, extendWithLoader } from '../../components';
import { ITEMS_LOADER_ID } from '../../helpers';

const PaginatedTable = extendWithLoader(extendWithPagination(GenericTable));

@asyncConnect([{
  key: 'items',
  promise: ({params, store}) => {

    const appState: IAppState = store.getState();
    const itemsState = appState.items;

    if (itemsState.allItemsLoaded) {
      return Promise.resolve();
    } else {
      return store.dispatch(getItems(ITEMS_LOADER_ID));
    }
  },
}])
class AdminItemsPageComponent extends React.Component<any, any> {

  get columns(): IGenericTableColumn[] {
    return [
      {
        title: 'Id',
        dataProp: 'id',
        searchable: true,
      },
      {
        title: 'Name',
        dataProp: 'name',
        sortType: 'string',
        searchable: true,
      },
      {
        title: 'City',
        dataProp: 'city',
        sortType: 'string',
        format: (cityId: string) => this.props.citiesMap[cityId].name,
        searchable: true,
      },
      {
        title: 'Types',
        dataProp: 'types',
        format: (types: string[]) => {
          return (
            <ItemTypesList
              typeIds={types}
              typesMap={this.props.typesMap}
            />
          );
        },
      },
      {
        title: 'Created at',
        dataProp: 'createdAt',
        sortType: 'date',
        format: (date: string) => moment(date).format('YYYY-MM-DD'),
      },
      {
        title: 'Actions',
        dataProp: 'id',
        format: (id) => {
          return (
            <div>
              <Link	to={`/admin/items/edit/${id}`}>Edit</Link>
              <div onClick={this.onDelete.bind(null, id)}>Delete action</div>
            </div>
          );
        },
      },
    ];
  }

  onEdit(id) {
    console.log('Open edit', id);
  }

  onDelete(id) {
    console.log('Open delete', id);
  }

  render() {
    return (
      <PaginatedTable
        loaderId={ITEMS_LOADER_ID}
        dataMap={this.props.itemsMap}
        search={this.props.search}
        columns={this.columns}
        limit={10}
      />
    );

  };
};

const mapStateToProps = (state: IAppState) => {
  return {
    itemsMap: state.items.dataMap,
    citiesMap: state.cities.dataMap,
    typesMap: state.types.dataMap,
  };
};

export const AdminItemsPage = connect(mapStateToProps)(AdminItemsPageComponent);
