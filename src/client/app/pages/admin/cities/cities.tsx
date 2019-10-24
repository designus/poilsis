import * as React from 'react';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { IAppState, ICitiesMap, ITypesMap } from 'types';
import { getCitiesList, getCitiesMap, getAdminLocale, getTypesMap } from 'selectors';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getLocalizedText } from 'client-utils/methods';
import { adminRoutes } from 'client-utils/routes';
import { deleteCity } from 'actions/cities';
import { ICity, TranslatableField } from 'global-utils/typings';

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
  locale: string;
}

class AdminCitiesPageComponent extends React.Component<ICitiesPageParams, any> {

  state = {
    isDeleteModalOpen: false,
    deleteId: ''
  };

  get deleteCityName(): string {
    const city = this.props.citiesMap[this.state.deleteId];
    if (city) {
      return getLocalizedText(city.name, this.props.locale);
    }

    return '';
  }

  get columns(): Array<ITableColumn<ICity>> {
    const { formatMessage } = this.props.intl;
    return [
      {
        headerName: formatMessage({ id: 'admin.common_fields.id'}),
        field: 'id'
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.name'}),
        field: 'name',
        cellRenderer: (city) => getLocalizedText(city.name, this.props.locale)
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.types'}),
        field: 'types',
        cellRenderer: (city) => {
          return (
            <ItemTypesList locale={this.props.locale} typeIds={city.types} />
          );
        }
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.actions'}),
        field: 'id',
        cellRenderer: (city) => {
          return (
            <ItemActions
              editLink={adminRoutes.editCity.getLink(city.id)}
              onDelete={this.openDeleteModal(city.id)}
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
  typesMap: getTypesMap(state),
  citiesMap: getCitiesMap(state),
  cities: getCitiesList(state),
  locale: getAdminLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  deleteCity: (cityId: string) => dispatch(deleteCity(cityId))
});

export const AdminCitiesPage = injectIntl(
  connect<{}, {}, ICitiesPageParams>(mapStateToProps, mapDispatchToProps)(AdminCitiesPageComponent)
);
