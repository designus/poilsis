import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { IAppState, ITypesMap } from 'reducers';
import { AdminHeader } from 'global-styles';
import { adminRoutes, CONTENT_LOADER_ID } from 'client-utils';
import {
  EnhancedTable,
  ITableColumn,
  extendWithLoader,
  ItemActions,
  DeleteModal,
  AdminPageActions,
} from 'components';

const Table = extendWithLoader(EnhancedTable);

interface ITypesPageParams {
  typesMap: ITypesMap;
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
    return [
      {
        title: 'Id',
        dataProp: 'id',
      },
      {
        title: 'Name',
        dataProp: 'name',
      },
      {
        title: 'Description',
        dataProp: 'description',
      },
      {
        title: 'Actions',
        dataProp: 'id',
        formatProps: ['userId', 'id'],
        format: (userId: string, typeId: string) => {
          return (
            <ItemActions
              editLink={adminRoutes.editItemMain.getLink(userId, typeId)}
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
    console.log('Deleting ', typeId);
  }

  render() {
    return (
      <div>
        <AdminHeader>
          <Typography variant="headline">
            Types
          </Typography>
          <AdminPageActions createLink={adminRoutes.createItemMain.getLink()} />
        </AdminHeader>
        <Table
          showLoadingOverlay={true}
          loaderId={CONTENT_LOADER_ID}
          dataMap={this.props.typesMap}
          items={Object.keys(this.props.typesMap)}
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
  typesMap: state.types.dataMap,
});

const mapDispatchToProps = (dispatch) => {
  return {
    // deleteItem: (itemId) => dispatch(deleteItem(itemId)),
    // getUserItems: () => dispatch(getUserItems()),
    // endLoading: () => dispatch(endLoading()),
  };
};

export const AdminTypesPage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(AdminTypesPageComponent);
