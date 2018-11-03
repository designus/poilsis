import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { IAppState, ICitiesMap, ITypesMap } from 'reducers';
import { AdminHeader } from 'global-styles';
import { adminRoutes, CONTENT_LOADER_ID } from 'client-utils';
import { deleteCity } from 'actions';
import {
  EnhancedTable,
  ITableColumn,
  extendWithLoader,
  ItemActions,
  ItemTypesList,
  DeleteModal,
  AdminPageActions,
} from 'components';

const Table = extendWithLoader(EnhancedTable);

interface ICitiesPageParams {
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  deleteCity: (typeId) => Promise<any>;
}

class AdminCitiesPageComponent extends React.Component<ICitiesPageParams, any> {

  state = {
    isDeleteModalOpen: false,
    deleteId: '',
  };

  get deleteTypeName() {
    const city = this.props.citiesMap[this.state.deleteId];
    return city && city.name;
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
        title: 'Types',
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
        title: 'Actions',
        dataProp: 'id',
        format: (cityId: string) => {
          return (
            <ItemActions
              editLink={adminRoutes.editCity.getLink(cityId)}
              onDelete={this.openDeleteModal(cityId)}
            />
          );
        },
      },
    ];
  }

  openDeleteModal = (cityId) => () => {
    this.setState({ isDeleteModalOpen: true, deleteId: cityId });
  }

  handleModalClose = () => {
    this.setState({ isDeleteModalOpen: false });
  }

  handleCityDelete = (cityId) => {
    return this.props.deleteCity(cityId);
  }

  render() {
    return (
      <div>
        <AdminHeader>
          <Typography variant="h5">
            Cities
          </Typography>
          <AdminPageActions createLink={adminRoutes.createCity.getLink()} />
        </AdminHeader>
        <Table
          showLoadingOverlay={true}
          loaderId={CONTENT_LOADER_ID}
          dataMap={this.props.citiesMap}
          items={Object.keys(this.props.citiesMap)}
          columns={this.columns}
          limit={10}
        />
        <DeleteModal
          itemId={this.state.deleteId}
          isModalOpen={this.state.isDeleteModalOpen}
          onClose={this.handleModalClose}
          onDelete={this.handleCityDelete}
          itemName={this.deleteTypeName}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  typesMap: state.types.dataMap,
  citiesMap: state.cities.dataMap,
});

const mapDispatchToProps = (dispatch) => ({
  deleteCity: (cityId) => dispatch(deleteCity(cityId)),
});

export const AdminCitiesPage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(AdminCitiesPageComponent);
