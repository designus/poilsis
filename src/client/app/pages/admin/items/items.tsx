import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Typography from '@material-ui/core/Typography';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { IAppState, IItemsMap, IUsersMap, ICitiesMap, ITypesMap, IItem } from 'reducers';
import { loadUserItems, deleteItem, endLoading, toggleItem } from 'actions';
import { adminRoutes, CONTENT_LOADER_ID } from 'client-utils';
import { shouldLoadUserItems, getUserItems } from 'selectors';
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

interface IItemsPageParams extends InjectedIntlProps {
  itemsMap: IItemsMap;
  usersMap: IUsersMap;
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  shouldLoadUserItems: boolean;
  userItems: IItem[];
  deleteItem: (itemId: string) => Promise<void>;
  loadUserItems: () => void;
  endLoading: (loaderId) => void;
  toggleItem: (itemId: string, isEnabled: boolean) => void;
}

class AdminItemsPageComponent extends React.Component<IItemsPageParams, any> {

  static fetchData(store) {
    return store.dispatch(loadUserItems());
  }

  state = {
    isDeleteModalOpen: false,
    deleteId: '',
    search: '',
  };

  componentDidMount() {
    this.loadUserItems();
  }

  componentDidUpdate() {
    this.loadUserItems();
  }

  loadUserItems = () => {
    if (this.props.shouldLoadUserItems) {
      this.props.loadUserItems();
    }
  }

  get columns(): ITableColumn[] {
    const { formatMessage, formatDate } = this.props.intl;
    return [
      {
        title: formatMessage({ id: 'admin.common_fields.id' }),
        dataProp: 'id',
        searchable: true,
      },
      {
        title: formatMessage({ id: 'admin.common_fields.name' }),
        dataProp: 'name',
        sortType: 'string',
        searchable: true,
      },
      {
        title: formatMessage({ id: 'admin.common_fields.city' }),
        dataProp: 'cityId',
        sortType: 'string',
        format: (cityId: string) => this.props.citiesMap[cityId].name,
        searchable: true,
      },
      {
        title: formatMessage({ id: 'admin.common_fields.types' }),
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
        title: formatMessage({ id: 'admin.common_fields.created_at' }),
        dataProp: 'createdAt',
        sortType: 'date',
        format: (date: string) => formatDate(date),
      },
      {
        title: formatMessage({ id: 'admin.common_fields.user' }),
        dataProp: 'userId',
        sortType: 'string',
        format: (userId: string) => {
          const user = this.props.usersMap[userId];
          return user && user.name || null;
        },
      },
      {
        title: formatMessage({ id: 'admin.common_fields.is_enabled' }),
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
        title: formatMessage({ id: 'admin.common_fields.actions' }),
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

  handleItemDelete = (itemId: string) => {
    return this.props.deleteItem(itemId);
  }

  componentWillUnmount() {
    this.props.endLoading(CONTENT_LOADER_ID);
  }

  render() {
    return (
      <div>
        <AdminHeader>
          <Typography variant="h5">
            <FormattedMessage id="admin.menu.items" />
          </Typography>
          <AdminPageActions
            search={this.setSearch}
            createLink={adminRoutes.createItemMain.getLink()}
          />
        </AdminHeader>
        <Table
          showLoadingOverlay={true}
          loaderId={CONTENT_LOADER_ID}
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
  userItems: getUserItems(state),
  citiesMap: state.cities.dataMap,
  typesMap: state.types.dataMap,
  shouldLoadUserItems: shouldLoadUserItems(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteItem,
      loadUserItems,
      endLoading,
      toggleItem,
    },
    dispatch,
  );

export const AdminItemsPage = injectIntl(
  connect<{}, {}, IItemsPageParams>(mapStateToProps, mapDispatchToProps)(AdminItemsPageComponent),
);
