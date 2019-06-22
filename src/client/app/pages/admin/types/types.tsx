import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { IAppState, ITypesMap, IType } from 'reducers';
import { AdminHeader } from 'global-styles';
import { adminRoutes, CONTENT_LOADER_ID } from 'client-utils';
import { deleteType } from 'actions';
import { getTypes, getTypesMap } from 'selectors';

import { EnhancedTable, ITableColumn } from 'components/table';
import { extendWithLoader } from 'components/extendWithLoader';
import { ItemActions } from 'components/itemActions';
import { DeleteModal } from 'components/modals';
import { AdminPageActions } from 'components/adminPageActions';

const Table = extendWithLoader(EnhancedTable);

interface ITypesPageParams extends InjectedIntlProps {
  typesMap: ITypesMap;
  types: IType[];
  deleteType: (typeId: string) => Promise<any>;
}

class AdminTypesPageComponent extends React.Component<ITypesPageParams, any> {

  state = {
    isDeleteModalOpen: false,
    deleteId: '',
  };

  get deleteTypeName() {
    const type = this.props.typesMap[this.state.deleteId];
    return type && type.name;
  }

  get columns(): ITableColumn[] {
    const { formatMessage } = this.props.intl;
    return [
      {
        title: formatMessage({id: 'admin.common_fields.id'}),
        dataProp: 'id',
      },
      {
        title: formatMessage({id: 'admin.common_fields.name'}),
        dataProp: 'name',
      },
      {
        title: formatMessage({id: 'admin.common_fields.description'}),
        dataProp: 'description',
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
        },
      },
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
      <div>
        <AdminHeader>
          <Typography variant="h5">
            <FormattedMessage id="admin.menu.types" />
          </Typography>
          <AdminPageActions createLink={adminRoutes.createType.getLink()} />
        </AdminHeader>
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
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  typesMap: getTypesMap(state),
  types: getTypes(state),
});

const mapDispatchToProps = (dispatch) => ({
  deleteType: (typeId: string) => dispatch(deleteType(typeId)),
});

export const AdminTypesPage = injectIntl(
  connect<{}, {}, ITypesPageParams>(mapStateToProps, mapDispatchToProps)(AdminTypesPageComponent),
);
