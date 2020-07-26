import * as React from 'react';
import { connect } from 'react-redux';
import { injectIntl, WrappedComponentProps as InjectedIntlProps } from 'react-intl';

import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { adminRoutes } from 'client-utils/routes';
import { deleteType, toggleTypeEnabled } from 'actions/types';
import { getTypes, getTypesMap, getAdminLocale } from 'selectors';
import { getLocalizedText } from 'client-utils/methods';
import { Locale } from 'global-utils';
import { Type } from 'global-utils/data-models';
import { EnableInput } from 'global-utils/input-types';
import { IAppState, ITypesMap, ThunkDispatch, ThunkReturn } from 'types';

import { EnhancedTable, ITableColumn } from 'components/table';
import { extendWithLoader } from 'components/extendWithLoader';
import { ItemActions } from 'components/itemActions';
import { DeleteModal } from 'components/modals/deleteModal';
import { AdminHeader } from 'components/adminHeader';
import { ToggleEnabled } from 'components/toggleEnabled';

const Table = extendWithLoader(EnhancedTable);

interface IOwnProps extends InjectedIntlProps {}

interface IDispatchProps {
  deleteType: ThunkReturn<typeof deleteType>;
  toggleTypeEnabled: ThunkReturn<typeof toggleTypeEnabled>;
}

interface IStateProps {
  typesMap: ITypesMap;
  types: Type[];
  locale: Locale;
}

type Props = IOwnProps & IStateProps & IDispatchProps;

type State = {
  isDeleteModalOpen: boolean;
  deleteId: string;
};

class AdminTypesPage extends React.Component<Props, State> {

  state = {
    isDeleteModalOpen: false,
    deleteId: ''
  };

  get deleteTypeName(): string {
    const type = this.props.typesMap[this.state.deleteId];
    if (type) {
      return getLocalizedText(this.props.locale, type.name);
    }

    return '';
  }

  getColumns(): Array<ITableColumn<Type>> {
    const { formatMessage } = this.props.intl;
    return [
      {
        headerName: formatMessage({id: 'admin.common_fields.id'}),
        field: 'id'
      },
      {
        headerName: formatMessage({id: 'admin.common_fields.name'}),
        field: 'name',
        cellRenderer: (type) => getLocalizedText(this.props.locale, type.name)
      },
      {
        headerName: formatMessage({id: 'admin.common_fields.description'}),
        field: 'description',
        cellRenderer: (type) => getLocalizedText(this.props.locale, type.description)
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.is_enabled' }),
        field: 'isEnabled',
        sortType: 'string',
        cellRenderer: (type) => {
          return (
            <ToggleEnabled
              item={type}
              onToggle={this.props.toggleTypeEnabled}
            />
          );
        }
      },
      {
        headerName: formatMessage({id: 'admin.common_fields.actions'}),
        field: 'id',
        cellRenderer: (type) => {
          return (
            <ItemActions
              editLink={adminRoutes.editType.getLink(type.id)}
              onDelete={this.openDeleteModal(type.id)}
            />
          );
        }
      }
    ];
  }

  openDeleteModal = (typeId: string) => () => {
    this.setState({ isDeleteModalOpen: true, deleteId: typeId });
  }

  handleModalClose = () => {
    this.setState({ isDeleteModalOpen: false });
  }

  handleTypeDelete = (typeId: string) => {
    return this.props.deleteType(typeId);
  }

  render() {
    return (
      <React.Fragment>
        <AdminHeader
          translationId="admin.menu.types"
          showActions
          createLink={adminRoutes.createType.getLink()}
        />
        <Table
          showLoadingOverlay={true}
          loaderId={CONTENT_LOADER_ID}
          items={this.props.types}
          columns={this.getColumns()}
          limit={10}
        />
        <DeleteModal
          itemId={this.state.deleteId}
          isModalOpen={this.state.isDeleteModalOpen}
          onClose={this.handleModalClose}
          onDelete={this.handleTypeDelete}
          itemName={this.deleteTypeName}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IAppState): IStateProps => ({
  typesMap: getTypesMap(state),
  types: getTypes(state),
  locale: getAdminLocale(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  deleteType: (typeId: string) => dispatch(deleteType(typeId)),
  toggleTypeEnabled: (params: EnableInput) => dispatch(toggleTypeEnabled(params))
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(AdminTypesPage)
);
