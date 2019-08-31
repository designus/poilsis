import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { IAppState } from 'reducers';
import { IItemsMap, ICitiesMap, IUsersMap } from 'types';
import { deleteItem, toggleItemEnabled, toggleItemRecommended } from 'actions/items';
import { loadUserItems } from 'actions/currentUser';
import { endLoading } from 'actions/loader';
import { adminRoutes } from 'client-utils/routes';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getLocalizedText } from 'client-utils/methods';
import {
  shouldLoadUserItems,
  getUserItems,
  getLocale,
  getCitiesMap,
  getItemsMap,
  getUsersMap
} from 'selectors';

import { EnhancedTable, ITableColumn } from 'components/table';
import { ItemTypesList } from 'components/itemTypesList';
import { extendWithLoader } from 'components/extendWithLoader';
import { ItemActions } from 'components/itemActions';
import { DeleteModal } from 'components/modals/deleteModal';
import { ToggleAction } from 'components/toggleAction';
import { ToggleRecommended } from 'components/toggleRecommended';
import { AdminHeader } from 'components/adminHeader';
import { TranslatableField, IItem } from 'global-utils/typings';

const Table = extendWithLoader(EnhancedTable);

interface IOwnProps extends InjectedIntlProps {}

interface IDispatchProps {
  deleteItem: (itemId: string) => Promise<void>;
  loadUserItems: () => void;
  endLoading: (loaderId: string) => void;
  toggleItemEnabled: (itemId: string, isEnabled: boolean) => void;
  toggleItemRecommended: (itemId: string, isRecommended: boolean) => void;
}

interface IStateProps {
  itemsMap: IItemsMap;
  usersMap: IUsersMap;
  citiesMap: ICitiesMap;
  shouldLoadUserItems: boolean;
  userItems: IItem[];
  locale: string;
}

type IItemsPageProps = IOwnProps & IStateProps & IDispatchProps;

class AdminItemsPage extends React.Component<IItemsPageProps, any> {

  static fetchData(store) {
    return store.dispatch(loadUserItems());
  }

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

  get columns(): ITableColumn[] {
    const { formatMessage, formatDate } = this.props.intl;
    return [
      {
        title: formatMessage({ id: 'admin.common_fields.id' }),
        dataProp: 'id',
        searchable: true
      },
      {
        title: formatMessage({ id: 'admin.common_fields.name' }),
        dataProp: 'name',
        sortType: 'string',
        format: (name: TranslatableField) => getLocalizedText(name, this.props.locale),
        searchable: true
      },
      {
        title: formatMessage({ id: 'admin.common_fields.city' }),
        dataProp: 'cityId',
        sortType: 'string',
        format: (cityId: string) => getLocalizedText(this.props.citiesMap[cityId].name, this.props.locale),
        searchable: true
      },
      {
        title: formatMessage({ id: 'admin.common_fields.types' }),
        dataProp: 'types',
        format: (types: string[]) => {
          return (
            <ItemTypesList typeIds={types} />
          );
        }
      },
      {
        title: formatMessage({ id: 'admin.common_fields.created_at' }),
        dataProp: 'createdAt',
        sortType: 'date',
        format: (date: string) => formatDate(date)
      },
      {
        title: formatMessage({ id: 'admin.common_fields.user' }),
        dataProp: 'userId',
        sortType: 'string',
        format: (userId: string) => {
          const user = this.props.usersMap[userId];
          return user && user.name || null;
        }
      },
      {
        title: formatMessage({ id: 'admin.common_fields.is_enabled' }),
        dataProp: 'isEnabled',
        sortType: 'string',
        formatProps: ['id', 'isEnabled'],
        format: (itemId: string, isEnabled: boolean) => (
          <ToggleAction
            isEnabled={isEnabled}
            onToggle={this.toggleItemEnabled(itemId, !isEnabled)}
          />
        )
      },
      {
        title: formatMessage({ id: 'admin.common_fields.is_recommended' }),
        dataProp: 'isRecommended',
        sortType: 'string',
        formatProps: ['id', 'isRecommended'],
        format: (itemId: string, isRecommended: boolean) => (
          <ToggleRecommended
            isRecommended={isRecommended}
            onToggle={this.toggleItemRecommended(itemId, !isRecommended)}
          />
        )
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
        }
      }
    ];
  }

  toggleItemEnabled = (itemId: string, isEnabled: boolean) => () => {
    this.props.toggleItemEnabled(itemId, isEnabled);
  }

  toggleItemRecommended = (itemId: string, isRecommended: boolean) => () => {
    this.props.toggleItemRecommended(itemId, isRecommended);
  }

  setSearch = (search: string) => {
    this.setState({search});
  }

  openDeleteModal = (itemId) => () => {
    this.setState({ isDeleteModalOpen: true, deleteId: itemId });
  }

  handleModalClose = () => {
    this.setState({ isDeleteModalOpen: false });
  }

  get deleteItemName(): string {
    const item = this.props.itemsMap[this.state.deleteId];
    if (item) {
      return getLocalizedText(item.name, this.props.locale);
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
          search={this.setSearch}
          createLink={adminRoutes.createItemMain.getLink()}
        />
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  itemsMap: getItemsMap(state),
  usersMap: getUsersMap(state),
  userItems: getUserItems(state),
  citiesMap: getCitiesMap(state),
  shouldLoadUserItems: shouldLoadUserItems(state),
  locale: getLocale(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteItem,
      loadUserItems,
      endLoading,
      toggleItemEnabled,
      toggleItemRecommended
    },
    dispatch
  );

export default injectIntl(
  connect<IStateProps, {}, IOwnProps>(mapStateToProps, mapDispatchToProps)(AdminItemsPage)
);
