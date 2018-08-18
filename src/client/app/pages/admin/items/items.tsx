import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Typography from '@material-ui/core/Typography';

import { IAppState, IItemsMap, IUsersMap, ICitiesMap, ITypesMap } from 'reducers';
import { getUserItems, deleteItem, endLoading, toggleItem } from 'actions';
import { adminRoutes, CONTENT_LOADER_ID } from 'client-utils';
import { ITEMS } from 'data-strings';
import { AdminHeader } from 'global-styles';
import {
  EnhancedTable,
  ITableColumn,
  ItemTypesList,
  extendWithLoader,
  ItemActions,
  DeleteModal,
  AdminPageActions,
  ToggleAction,
} from 'components';

const Table = extendWithLoader(EnhancedTable);

interface IItemsPageParams {
  itemsMap: IItemsMap;
  usersMap: IUsersMap;
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  areAllItemsLoaded: boolean;
  userItems: string[];
  deleteItem: (itemId) => void;
  getUserItems: () => void;
  endLoading: (loaderId) => void;
  toggleItem: (itemId: string, isEnabled: boolean) => void;
}

class AdminItemsPageComponent extends React.Component<IItemsPageParams, any> {

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
        title: 'Is enabled?',
        dataProp: 'isEnabled',
        sortType: 'string',
        formatProps: ['id', 'isEnabled'],
        format: (itemId: string, isEnabled: boolean) => (
          <ToggleAction
            isEnabled={isEnabled}
            onToggle={this.toggleItemVisibility(itemId, !isEnabled)}
          />
        ),
      },
      {
        title: 'Actions',
        dataProp: 'id',
        formatProps: ['userId', 'id'],
        format: (userId: string, itemId: string) => {
          return (
            <ItemActions
              editLink={adminRoutes.editItemMain.getLink(userId, itemId)}
              onDelete={this.openDeleteModal(itemId)}
            />
          );
        },
      },
    ];
  }

  toggleItemVisibility = (itemId: string, isEnabled: boolean) => () => {
    this.props.toggleItem(itemId, isEnabled);
  }

  setSearch = (search) => {
    this.setState({search});
  }

  openDeleteModal = (itemId) => () => {
    this.setState({ isDeleteModalOpen: true, deleteId: itemId });
  }

  handleModalClose = () => {
    this.setState({ isDeleteModalOpen: false });
  }

  get deleteItemName() {
    const item = this.props.itemsMap[this.state.deleteId];
    return item && item.name;
  }

  handleItemDelete = (itemId) => {
    return this.props.deleteItem(itemId);
  }

  componentWillUnmount() {
    this.props.endLoading(CONTENT_LOADER_ID);
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
          showLoadingOverlay={true}
          loaderId={CONTENT_LOADER_ID}
          dataMap={this.props.itemsMap}
          items={this.props.userItems}
          search={this.state.search}
          columns={this.columns}
          limit={10}
        />
        <DeleteModal
          itemId={this.state.deleteId}
          isModalOpen={this.state.isDeleteModalOpen}
          onClose={this.handleModalClose}
          onDelete={this.handleItemDelete}
          itemName={this.deleteItemName}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  itemsMap: state.items.dataMap,
  usersMap: state.users.dataMap,
  userItems: state.currentUser.items,
  citiesMap: state.cities.dataMap,
  typesMap: state.types.dataMap,
  areAllItemsLoaded: state.items.isAllLoaded,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteItem,
      getUserItems,
      endLoading,
      toggleItem,
    },
    dispatch,
  );

export const AdminItemsPage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(AdminItemsPageComponent);
