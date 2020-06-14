import * as React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { IAppState, ThunkDispatch } from 'types';
import { getAllCities, getCitiesMap, getAdminLocale, getTypesMap } from 'selectors';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getLocalizedText } from 'client-utils/methods';
import { adminRoutes } from 'client-utils/routes';
import { deleteCity, toggleCityEnabled } from 'actions/cities';
import { City } from 'global-utils/data-models';

import { EnhancedTable, ITableColumn } from 'components/table';
import { extendWithLoader } from 'components/extendWithLoader';
import { ItemActions } from 'components/itemActions';
import { ItemTypesList } from 'components/itemTypesList';
import { DeleteModal } from 'components/modals/deleteModal';
import { AdminHeader } from 'components/adminHeader';
import { ToggleEnabled } from 'components/toggleEnabled';

const Table = extendWithLoader(EnhancedTable);

import { State, Props, IOwnProps, IDispatchProps, IStateProps } from './types';

class AdminCitiesPage extends React.Component<Props, State> {

  state = {
    isDeleteModalOpen: false,
    deleteId: ''
  };

  get deleteCityName(): string {
    const city = this.props.citiesMap[this.state.deleteId];
    if (city) {
      return getLocalizedText(this.props.locale, city.name);
    }

    return '';
  }

  get columns(): Array<ITableColumn<City>> {
    const { formatMessage } = this.props.intl;
    return [
      {
        headerName: formatMessage({ id: 'admin.common_fields.id'}),
        field: 'id'
      },
      {
        headerName: formatMessage({ id: 'admin.common_fields.name'}),
        field: 'name',
        cellRenderer: (city) => getLocalizedText(this.props.locale, city.name)
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
        headerName: formatMessage({ id: 'admin.common_fields.is_enabled' }),
        field: 'isEnabled',
        sortType: 'string',
        cellRenderer: (city) => {
          return (
            <ToggleEnabled
              item={city}
              onToggle={this.props.toggleCityEnabled}
            />
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
          showActions
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

const mapStateToProps = (state: IAppState): IStateProps => ({
  typesMap: getTypesMap(state),
  citiesMap: getCitiesMap(state),
  cities: getAllCities(state),
  locale: getAdminLocale(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  deleteCity: cityId => dispatch(deleteCity(cityId)),
  toggleCityEnabled: params => dispatch(toggleCityEnabled(params))
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(AdminCitiesPage)
);
