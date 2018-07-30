import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { IAppState } from 'reducers';
import { AdminHeader } from 'global-styles';
import { adminRoutes } from 'client-utils';
import {
  EnhancedTable,
  ITableColumn,
  ItemTypesList,
  extendWithLoader,
  ItemActions,
  DeleteModal,
  AdminPageActions,
} from 'components';

const Table = extendWithLoader(EnhancedTable);

class AdminTypesPageComponent extends React.Component<any, any> {

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
    console.log('Open delete modal', typeId);
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
          dataMap={this.props.typesMap}
          items={Object.keys(this.props.typesMap)}
          columns={this.columns}
          limit={10}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    typesMap: state.types.dataMap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // deleteItem: (itemId) => dispatch(deleteItem(itemId)),
    // getUserItems: () => dispatch(getUserItems()),
    // endLoading: () => dispatch(endLoading()),
  };
};

export const AdminTypesPage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(AdminTypesPageComponent);
