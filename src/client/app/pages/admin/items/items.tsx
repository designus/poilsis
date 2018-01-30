import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import { IAppState } from '../../../reducers';
import { getItems, deleteItem } from '../../../actions';
import { ITEMS_LOADER_ID, DELETE_ITEM_LOADER_ID, adminRoutes } from '../../../client-utils';
import { ITEMS } from '../../../../../data-strings';
import { AdminHeader } from '../../../global-styles';
import {
  EnhancedTable,
  ITableColumn,
  ItemTypesList,
  extendWithLoader,
  ItemActions,
  DeleteModal,
  AdminPageActions,
} from '../../../components';

const Table = extendWithLoader(EnhancedTable);

class AdminItemsPageComponent extends React.Component<any, any> {

  static fetchData(store) {
    return store.dispatch(getItems(ITEMS_LOADER_ID));
  }

  state = {
    isDeleteModalOpen: false,
    deleteId: '',
    search: '',
  };

  componentDidMount() {
    if (!this.props.areAllItemsLoaded) {
      this.props.getItems(ITEMS_LOADER_ID);
    }
  }

  get columns(): ITableColumn[] {
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
          limit={10}
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
    areAllItemsLoaded: state.items.allItemsLoaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (itemId) => dispatch(deleteItem(itemId, DELETE_ITEM_LOADER_ID)),
    getItems: (itemId) => dispatch(getItems(ITEMS_LOADER_ID)),
  };
};

export const AdminItemsPage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(AdminItemsPageComponent);
