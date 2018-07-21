import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { IAppState } from '../../../reducers';
import { getUserItems, deleteItem, stopAllLoaders } from '../../../actions';
import { CONTENT_LOADER_ID, adminRoutes } from '../../../client-utils';
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
    return store.dispatch(getUserItems());
  }

  state = {
    isDeleteModalOpen: false,
    deleteId: '',
    search: '',
  };

  componentDidMount() {
    if (!this.props.areAllItemsLoaded) {
      this.props.getUserItems();
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
        dataProp: 'cityId',
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
        title: 'User',
        dataProp: 'userId',
        sortType: 'string',
        format: (userId: string) => {
          const user = this.props.usersMap[userId];
          return user && user.name || null;
        },
      },
      {
        title: 'Actions',
        dataProp: 'id',
        formatProps: ['userId', 'id'],
        format: (userId: string, itemId: string) => {
          return (
            <ItemActions
              editLink={adminRoutes.editItemMain.getLink(userId, itemId)}
              onDelete={this.openDeleteModal.bind(this, itemId)}
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

  closeDeleteModal = () => {
    this.setState({isDeleteModalOpen: false});
  }

  get deleteItemName() {
    const item = this.props.itemsMap[this.state.deleteId];
    return item && item.name;
  }

  onDelete = (itemId) => {
    return this.props.deleteItem(itemId);
  }

  componentWillUnmount() {
    this.props.stopAllLoaders();
  }

  render() {
    return (
      <div>
        <AdminHeader>
          <Typography variant="headline">
            {ITEMS}
          </Typography>
          <AdminPageActions
            search={this.setSearch}
            createLink={adminRoutes.createItemMain.getLink()}
          />
        </AdminHeader>
        <Table
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          dataMap={this.props.itemsMap}
          items={this.props.userItems}
          search={this.state.search}
          columns={this.columns}
          limit={10}
        />
        <DeleteModal
          itemId={this.state.deleteId}
          isModalOpen={this.state.isDeleteModalOpen}
          onCloseModal={this.closeDeleteModal}
          onDelete={this.onDelete}
          itemName={this.deleteItemName}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    itemsMap: state.items.dataMap,
    usersMap: state.users.dataMap,
    userItems: state.currentUser.items,
    citiesMap: state.cities.dataMap,
    typesMap: state.types.dataMap,
    areAllItemsLoaded: state.items.isAllLoaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteItem: (itemId) => dispatch(deleteItem(itemId)),
    getUserItems: () => dispatch(getUserItems()),
    stopAllLoaders: () => dispatch(stopAllLoaders()),
  };
};

export const AdminItemsPage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(AdminItemsPageComponent);
