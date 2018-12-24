import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { IAppState, ICityState, IItemsState, ITypesState, ICity } from 'reducers';
import { getCityItems } from 'actions';
import { CONTENT_LOADER_ID } from 'client-utils';
import { ItemsList, NotFound, extendWithLoader } from 'components';

const ItemsListWithLoader = extendWithLoader(ItemsList);

interface IMatchParams {
  cityName: string;
  locale: string;
}

interface ICityPageParams extends RouteComponentProps<IMatchParams> {
  items: IItemsState;
  cities: ICityState;
  types: ITypesState;
  selectedCity: ICity;
  dispatch: () => void;
}

export const fetchCitiesData = (cityState: ICityState, routeParams: IMatchParams, dispatch) => {
  return new Promise((resolve, reject) => {
    const selectedCity = cityState.aliases.find(({ alias }) => alias === routeParams.cityName);
    if (selectedCity) {
      resolve(selectedCity);
    } else {
      reject('City is not available');
    }
  })
  .then(({ id: cityId }) => dispatch(getCityItems(cityId, routeParams.locale)))
  .catch(console.error);
};

class CityPageComponent extends React.Component<ICityPageParams, any> {

  static fetchData(store, params: IMatchParams) {
    const appState: IAppState = store.getState();
    const cityState = appState.cities;
    return fetchCitiesData(cityState, params, store.dispatch);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      fetchCitiesData(this.props.cities, this.props.match.params, this.props.dispatch);
    }
  }

  componentDidMount() {
    fetchCitiesData(this.props.cities, this.props.match.params, this.props.dispatch);
  }

  render() {
    const { selectedCity, items, types } = this.props;

    if (selectedCity) {
      return (
        <div>
          <h1>{selectedCity.name}</h1>
          <p>{selectedCity.description}</p>
          <ItemsListWithLoader
            loaderId={CONTENT_LOADER_ID}
            items={selectedCity.items}
            itemsMap={items.dataMap}
            typesMap={types.dataMap}
          />
        </div>
      );
    } else {
      return <NotFound/>;
    }
  }
}

const mapStateToProps = (state: IAppState) => ({
  selectedCity: state.cities.dataMap[state.cities.selectedId],
  cities: state.cities,
  items: state.items,
  types: state.types,
});

export const CityPage = connect<any, any, {}>(mapStateToProps)(CityPageComponent);
