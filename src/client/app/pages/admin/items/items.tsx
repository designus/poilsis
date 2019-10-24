import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { IAppState, IItemsMap, ICitiesMap, IUsersMap } from 'types';
import { deleteItem, toggleItemEnabled, toggleItemRecommended } from 'actions/items';
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
import { IItem } from 'global-utils/typings';
import { LANGUAGES } from 'global-utils/constants';

import { styles } from './styles';

const Table = extendWithLoader(EnhancedTable);

interface IOwnProps extends InjectedIntlProps, WithStyles<typeof styles> {}

interface IDispatchProps {
  deleteItem: (itemId: string) => Promise<void>;
  loadUserItems: () => void;
  endLoading: (loaderId: string) => void;
  toggleItemEnabled: (itemId: string, isEnabled: boolean, locale: string) => void;
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

export const loadUserItemsData = (store) => store.dispatch(loadUserItems());

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

  get columns(): Array<ITableColumn<IItem>> {
    const { formatMessage, formatDate } = this.props.intl;
    return [
      {
        headerName: formatMessage({ id: 'admin.common_fields.id' }),
        field: 'id',
        searchable: true
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.name' }),
        field: 'name',
        sortType: 'string',
        cellRenderer: item => getLocalizedText(item.name, this.props.locale),
        searchable: true
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.city' }),
        field: 'cityId',
        sortType: 'string',
        cellRenderer: (item) => getLocalizedText(this.props.citiesMap[item.cityId].name, this.props.locale),
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
            <div className={this.props.classes.isEnabledWrapper}>
              {LANGUAGES.map(lang => {
                const isDisabled = !item.name[lang];
                return (
                  <ToggleAction
                    isDisabled={isDisabled}
                    showTooltip={isDisabled}
                    tooltipText={formatMessage({ id: 'admin.items.toggle_tooltip_message'}, { language: lang })}
                    label={lang}
                    key={lang}
                    isEnabled={item.isEnabled[lang]}
                    onToggle={this.toggleItemEnabled(item.id, !item.isEnabled[lang], lang)}
                  />
                );
              })}
            </div>
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
  }

  toggleItemEnabled = (itemId: string, isEnabled: boolean, locale: string) => () => {
    this.props.toggleItemEnabled(itemId, isEnabled, locale);
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
  locale: getAdminLocale(state)
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
  withStyles(styles)(
    connect<IStateProps, {}, IOwnProps>(mapStateToProps, mapDispatchToProps)(AdminItemsPage)
  )
);
