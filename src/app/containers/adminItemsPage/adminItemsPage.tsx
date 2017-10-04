import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { asyncConnect} from 'redux-connect';
import { IAppState } from '../../reducers';
import { getItems, deleteItem } from '../../actions';
import { ITEMS_LOADER_ID, DELETE_ITEM_LOADER_ID } from '../../helpers';
import {
  GenericTable,
  IGenericTableColumn,
  ItemTypesList,
  extendWithPagination,
  extendWithLoader,
  ItemActions,
  DeleteModal,
} from '../../components';

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

  state = {
    isDeleteModalOpen: false,
  };

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
            <ItemActions
              editLink={`/admin/items/edit/${id}`}
              onDelete={this.openDeleteModal.bind(this, id)}
            />
          );
        },
      },
    ];
  }

  openDeleteModal(id) {
    this.setState({isDeleteModalOpen: true});
  }

  onDelete = (itemId) => {
    return this.props.deleteItem(itemId, DELETE_ITEM_LOADER_ID);
  }

  render() {
    return (
      <div>
        <PaginatedTable
          loaderId={ITEMS_LOADER_ID}
          dataMap={this.props.itemsMap}
          search={this.props.search}
          columns={this.columns}
          limit={10}
        />
        <DeleteModal
          loaderId={DELETE_ITEM_LOADER_ID}
          isDeleteModalOpen={this.state.isDeleteModalOpen}
          onDelete={this.onDelete}
        />
      </div>
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

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (itemId) => dispatch(deleteItem(itemId, DELETE_ITEM_LOADER_ID)),
  };
};

export const AdminItemsPage = connect(mapStateToProps, mapDispatchToProps)(AdminItemsPageComponent);
