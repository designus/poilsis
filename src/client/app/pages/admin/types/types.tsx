import * as React from 'react';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { IAppState, ITypesMap } from 'reducers';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { adminRoutes } from 'client-utils/routes';
import { deleteType } from 'actions/types';
import { getTypes, getTypesMap, getLocale } from 'selectors';
import { getLocalizedText } from 'client-utils/methods';
import { TranslatableField, IType } from 'global-utils/typings';

import { EnhancedTable, ITableColumn } from 'components/table';
import { extendWithLoader } from 'components/extendWithLoader';
import { ItemActions } from 'components/itemActions';
import { DeleteModal } from 'components/modals/deleteModal';
import { AdminHeader } from 'components/adminHeader';

const Table = extendWithLoader(EnhancedTable);

interface ITypesPageParams extends InjectedIntlProps {
  typesMap: ITypesMap;
  types: IType[];
  deleteType: (typeId: string) => Promise<any>;
  locale: string;
}

class AdminTypesPageComponent extends React.Component<ITypesPageParams, any> {

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

  get columns(): ITableColumn[] {
    const { formatMessage } = this.props.intl;
    return [
      {
        title: formatMessage({id: 'admin.common_fields.id'}),
        dataProp: 'id'
      },
      {
        title: formatMessage({id: 'admin.common_fields.name'}),
        dataProp: 'name',
        format: (name: TranslatableField) => getLocalizedText(name, this.props.locale)
      },
      {
        title: formatMessage({id: 'admin.common_fields.description'}),
        dataProp: 'description'
      },
      {
        title: formatMessage({id: 'admin.common_fields.actions'}),
        dataProp: 'id',
        format: (typeId: string) => {
          return (
            <ItemActions
              editLink={adminRoutes.editType.getLink(typeId)}
              onDelete={this.openDeleteModal(typeId)}
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
  locale: getLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  deleteType: (typeId: string) => dispatch(deleteType(typeId))
});

export const AdminTypesPage = injectIntl(
  connect<{}, {}, ITypesPageParams>(mapStateToProps, mapDispatchToProps)(AdminTypesPageComponent)
);
