import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { asyncConnect} from 'redux-connect';
import Typography from 'material-ui/Typography';
import { IAppState } from '../../../reducers';
import { getItems, deleteItem } from '../../../actions';
import { ITEMS_LOADER_ID, DELETE_ITEM_LOADER_ID, adminRoutes } from '../../../client-utils';
import { ITEMS } from '../../../../../data-strings';
import { AdminHeader } from '../../../global-styles';
import {
  // GenericTable,
  EnhancedTable,
  IGenericTableColumn,
  ItemTypesList,
  // extendWithPagination,
  extendWithLoader,
  ItemActions,
  DeleteModal,
  AdminPageActions,
} from '../../../components';

// const PaginatedTable = extendWithLoader(extendWithPagination(GenericTable));
const Table = extendWithLoader(EnhancedTable);

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
    deleteId: '',
    search: '',
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
              editLink={adminRoutes.editItemMain.getLink(id)}
              onDelete={this.openDeleteModal.bind(this, id)}
            />
          );
        },
      },
    ];
  }

  setSearch = (search) => {
    this.setState({search});
  }

  openDeleteModal(id) {
    this.setState({isDeleteModalOpen: true, deleteId: id});
  }

  get deleteItemName() {
    const item = this.props.itemsMap[this.state.deleteId];
    return item && item.name;
  }

  onDelete = (itemId) => {
    return this.props.deleteItem(itemId, DELETE_ITEM_LOADER_ID);
  }

  render() {
    return (
      <div>
        <AdminHeader>
          <Typography type="headline">
            {ITEMS}
          </Typography>
          <AdminPageActions
            search={this.setSearch}
            createLink={adminRoutes.createItemMain.getLink()}
          />
        </AdminHeader>
        <Table
          loaderId={ITEMS_LOADER_ID}
          dataMap={this.props.itemsMap}
          search={this.state.search}
          columns={this.columns}
          limit={20}
        />
        <DeleteModal
          loaderId={DELETE_ITEM_LOADER_ID}
          itemId={this.state.deleteId}
          isDeleteModalOpen={this.state.isDeleteModalOpen}
          onDelete={this.onDelete}
          itemName={this.deleteItemName}
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
