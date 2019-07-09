import * as React from 'react';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { IAppState, ICitiesMap, ICity, ITypesMap } from 'reducers';
import { getCities, getCitiesMap } from 'selectors';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { adminRoutes } from 'client-utils/routes';
import { deleteCity } from 'actions/cities';

import { EnhancedTable, ITableColumn } from 'components/table';
import { extendWithLoader } from 'components/extendWithLoader';
import { ItemActions } from 'components/itemActions';
import { ItemTypesList } from 'components/itemTypesList';
import { DeleteModal } from 'components/modals/deleteModal';
import { AdminHeader } from 'components/adminHeader';

const Table = extendWithLoader(EnhancedTable);

interface ICitiesPageParams extends InjectedIntlProps {
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  deleteCity: (typeId: string) => Promise<void>;
  cities: ICity[];
}

class AdminCitiesPageComponent extends React.Component<ICitiesPageParams, any> {

  state = {
    isDeleteModalOpen: false,
    deleteId: ''
  };

  get deleteCityName() {
    const city = this.props.citiesMap[this.state.deleteId];
    return city && city.name;
  }

  get columns(): ITableColumn[] {
    const { formatMessage } = this.props.intl;
    return [
      {
        title: formatMessage({ id: 'admin.common_fields.id'}),
        dataProp: 'id'
      },
      {
        title: formatMessage({ id: 'admin.common_fields.name'}),
        dataProp: 'name'
      },
      {
        title: formatMessage({ id: 'admin.common_fields.types'}),
        dataProp: 'types',
        format: (types: string[]) => {
          return (
            <ItemTypesList
              typeIds={types}
              typesMap={this.props.typesMap}
            />
          );
        }
      },
      {
        title: formatMessage({ id: 'admin.common_fields.actions'}),
        dataProp: 'id',
        format: (cityId: string) => {
          return (
            <ItemActions
              editLink={adminRoutes.editCity.getLink(cityId)}
              onDelete={this.openDeleteModal(cityId)}
            />
          );
        }
      }
    ];
  }

  openDeleteModal = (cityId: string) => () => {
    this.setState({ isDeleteModalOpen: true, deleteId: cityId });
  }

  handleModalClose = () => {
    this.setState({ isDeleteModalOpen: false });
  }

  handleCityDelete = (cityId: string) => {
    return this.props.deleteCity(cityId);
  }

  render() {
    return (
      <React.Fragment>
        <AdminHeader
          createLink={adminRoutes.createCity.getLink()}
          translationId="admin.menu.cities"
        />
        <Table
          showLoadingOverlay={true}
          loaderId={CONTENT_LOADER_ID}
          items={this.props.cities}
          columns={this.columns}
          limit={10}
        />
        <DeleteModal
          itemId={this.state.deleteId}
          isModalOpen={this.state.isDeleteModalOpen}
          onClose={this.handleModalClose}
          onDelete={this.handleCityDelete}
          itemName={this.deleteCityName}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  typesMap: state.types.dataMap,
  citiesMap: getCitiesMap(state),
  cities: getCities(state)
});

const mapDispatchToProps = (dispatch) => ({
  deleteCity: (cityId: string) => dispatch(deleteCity(cityId))
});

export const AdminCitiesPage = injectIntl(
  connect<{}, {}, ICitiesPageParams>(mapStateToProps, mapDispatchToProps)(AdminCitiesPageComponent)
);
