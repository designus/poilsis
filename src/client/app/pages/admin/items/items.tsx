import * as React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { IAppState, ThunkDispatch, ReduxStore } from 'types';
import { deleteItem, toggleItemEnabled, toggleItemRecommended, toggleItemApproved } from 'actions/items';
import { loadUserItems } from 'actions/currentUser';
import { endLoading } from 'actions/loader';
import { adminRoutes } from 'client-utils/routes';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getLocalizedText } from 'client-utils/methods';
import {
  shouldLoadUserItems,
  getUserItems,
  getAdminLocale,
  getCitiesMap,
  getItemsMap,
  getUsersMap,
  getCurrentUserRole
} from 'selectors';

import { EnhancedTable, ITableColumn } from 'components/table';
import { ItemTypesList } from 'components/itemTypesList';
import { extendWithLoader } from 'components/extendWithLoader';
import { ItemActions } from 'components/itemActions';
import { DeleteModal } from 'components/modals/deleteModal';
import { ToggleEnabled } from 'components/toggleEnabled';
import { ToggleRecommended } from 'components/toggleRecommended';
import { AdminHeader } from 'components/adminHeader';
import { ToggleAction } from 'components/toggleAction';
import { Item } from 'global-utils/data-models';
import { isAdmin } from 'global-utils/methods';

import { Props, IOwnProps, IStateProps, IDispatchProps, State } from './types';

const Table = extendWithLoader(EnhancedTable);

export const loadUserItemsData = (store: ReduxStore) => store.dispatch(loadUserItems());

class AdminItemsPage extends React.Component<Props, State> {
  state = {
    isDeleteModalOpen: false,
    deleteId: '',
    search: ''
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

  handleToggleApproved = (itemId: string, isApproved: boolean) => () => {
    this.props.toggleItemApproved(itemId, isApproved);
  }

  getColumns(): Array<ITableColumn<Item>> {
    const { formatMessage, formatDate } = this.props.intl;
    const columns: Array<ITableColumn<Item>> = [
      {
        headerName: formatMessage({ id: 'admin.common_fields.id' }),
        field: 'id',
        searchable: true
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.name' }),
        field: 'name',
        sortType: 'string',
        cellRenderer: item => getLocalizedText(this.props.locale, item.name),
        searchable: true
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.city' }),
        field: 'cityId',
        sortType: 'string',
        cellRenderer: (item) => getLocalizedText(this.props.locale, this.props.citiesMap[item.cityId].name),
        searchable: true
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.types' }),
        field: 'types',
        cellRenderer: (item) => {
          return (
            <ItemTypesList locale={this.props.locale} typeIds={item.types} />
          );
        }
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.created_at' }),
        field: 'createdAt',
        sortType: 'date',
        cellRenderer: (item) => formatDate(item.createdAt)
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.user' }),
        field: 'userId',
        sortType: 'string',
        cellRenderer: (item) => {
          const user = this.props.usersMap[item.userId];
          return user && user.name || null;
        }
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.is_enabled' }),
        field: 'isEnabled',
        sortType: 'string',
        cellRenderer: (item) => {
          return (
            <ToggleEnabled
              item={item}
              onToggle={this.props.toggleItemEnabled}
            />
          );
        }
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.actions' }),
        field: 'id',
        cellRenderer: (item) => {
          return (
            <ItemActions
              editLink={adminRoutes.editItemMain.getLink(item.userId, item.id)}
              onDelete={this.openDeleteModal(item.id)}
            />
          );
        }
      }
    ];

    if (isAdmin(this.props.userRole)) {
      columns.splice(columns.length - 1, 0,
        {
          headerName: formatMessage({ id: 'admin.common_fields.approved_by_admin' }),
          field: 'isApprovedByAdmin',
          sortType: 'string',
          cellRenderer: (item) => {
            return (
              <ToggleAction
                isEnabled={item.isApprovedByAdmin}
                onToggle={this.handleToggleApproved(item.id, !item.isApprovedByAdmin)}
              />
            );
          }
        },
        {
          headerName: formatMessage({ id: 'admin.common_fields.is_recommended' }),
          field: 'isRecommended',
          sortType: 'string',
          cellRenderer: (item) => (
            <ToggleRecommended
              isRecommended={item.isRecommended}
              onToggle={this.toggleItemRecommended(item.id, !item.isRecommended)}
            />
          )
        }
      );
    }

    return columns;
  }

  toggleItemRecommended = (itemId: string, isRecommended: boolean) => () => {
    this.props.toggleItemRecommended(itemId, isRecommended);
  }

  setSearch = (search: string) => {
    this.setState({search});
  }

  openDeleteModal = (itemId: string) => () => {
    this.setState({ isDeleteModalOpen: true, deleteId: itemId });
  }

  handleModalClose = () => {
    this.setState({ isDeleteModalOpen: false });
  }

  get deleteItemName(): string {
    const item = this.props.itemsMap[this.state.deleteId];
    if (item) {
      return getLocalizedText(this.props.locale, item.name);
    }

    return '';
  }

  handleItemDelete = (itemId: string) => {
    return this.props.deleteItem(itemId);
  }

  componentWillUnmount() {
    this.props.endLoading(CONTENT_LOADER_ID);
  }

  render() {
    return (
      <React.Fragment>
        <AdminHeader
          translationId="admin.menu.items"
          showActions
          search={this.setSearch}
          createLink={adminRoutes.createItemMain.getLink()}
        />
        <Table
          showLoadingOverlay={true}
          loaderId={CONTENT_LOADER_ID}
          items={this.props.userItems}
          search={this.state.search}
          columns={this.getColumns()}
          limit={10}
        />
        <DeleteModal
          itemId={this.state.deleteId}
          isModalOpen={this.state.isDeleteModalOpen}
          onClose={this.handleModalClose}
          onDelete={this.handleItemDelete}
          itemName={this.deleteItemName}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => ({
  itemsMap: getItemsMap(state),
  usersMap: getUsersMap(state),
  userItems: getUserItems(state),
  citiesMap: getCitiesMap(state),
  userRole: getCurrentUserRole(state),
  shouldLoadUserItems: shouldLoadUserItems(state),
  locale: getAdminLocale(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  deleteItem: itemId => dispatch(deleteItem(itemId)),
  loadUserItems: () => dispatch(loadUserItems()),
  endLoading: loaderId => dispatch(endLoading(loaderId)),
  toggleItemEnabled: params => dispatch(toggleItemEnabled(params)),
  toggleItemRecommended: (itemId, isRecommended) => dispatch(toggleItemRecommended(itemId, isRecommended)),
  toggleItemApproved: (itemId, isApproved) => dispatch(toggleItemApproved(itemId, isApproved))
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(
    AdminItemsPage
  )
);
