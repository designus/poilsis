import * as React from 'react';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { adminRoutes } from 'client-utils/routes';
import { deleteType, toggleTypeEnabled } from 'actions/types';
import { getTypes, getTypesMap, getAdminLocale } from 'selectors';
import { getLocalizedText } from 'client-utils/methods';
import { IType } from 'global-utils/typings';
import { IAppState, ITypesMap, ToggleEnabledParams } from 'types';

import { EnhancedTable, ITableColumn } from 'components/table';
import { extendWithLoader } from 'components/extendWithLoader';
import { ItemActions } from 'components/itemActions';
import { DeleteModal } from 'components/modals/deleteModal';
import { AdminHeader } from 'components/adminHeader';
import { ToggleEnabled } from 'components/toggleEnabled';

const Table = extendWithLoader(EnhancedTable);

interface IOwnProps extends InjectedIntlProps {}

interface IDispatchProps {
  deleteType: (typeId: string) => Promise<void>;
  toggleTypeEnabled: (params: ToggleEnabledParams) => void;
}

interface IStateProps {
  typesMap: ITypesMap;
  types: IType[];
  locale: string;
}

type ITypesPageProps = IOwnProps & IStateProps & IDispatchProps;

class AdminTypesPage extends React.Component<ITypesPageProps, any> {

  state = {
    isDeleteModalOpen: false,
    deleteId: ''
  };

  get deleteTypeName(): string {
    const type = this.props.typesMap[this.state.deleteId];
    if (type) {
      return getLocalizedText(type.name, this.props.locale);
    }

    return '';
  }

  get columns(): Array<ITableColumn<IType>> {
    const { formatMessage } = this.props.intl;
    return [
      {
        headerName: formatMessage({id: 'admin.common_fields.id'}),
        field: 'id'
      },
      {
        headerName: formatMessage({id: 'admin.common_fields.name'}),
        field: 'name',
        cellRenderer: (type) => getLocalizedText(type.name, this.props.locale)
      },
      {
        headerName: formatMessage({id: 'admin.common_fields.description'}),
        field: 'description',
        cellRenderer: (type) => getLocalizedText(type.description, this.props.locale)
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

  openDeleteModal = (typeId) => () => {
    this.setState({ isDeleteModalOpen: true, deleteId: typeId });
  }

  handleModalClose = () => {
    this.setState({ isDeleteModalOpen: false });
  }

  handleTypeDelete = (typeId) => {
    return this.props.deleteType(typeId);
  }

  render() {
    return (
      <React.Fragment>
        <AdminHeader
          translationId="admin.menu.types"
          createLink={adminRoutes.createType.getLink()}
        />
        <Table
          showLoadingOverlay={true}
          loaderId={CONTENT_LOADER_ID}
          items={this.props.types}
          columns={this.columns}
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

const mapStateToProps = (state: IAppState) => ({
  typesMap: getTypesMap(state),
  types: getTypes(state),
  locale: getAdminLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  deleteType: (typeId: string) => dispatch(deleteType(typeId)),
  toggleTypeEnabled: (params: ToggleEnabledParams) => dispatch(toggleTypeEnabled(params))
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(AdminTypesPage)
);
