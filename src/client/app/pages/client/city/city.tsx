import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState, ICityState, IItemsState } from '../../../reducers';
import { getCityItems, selectCity } from '../../../actions';
import { getSelectedCity, CONTENT_LOADER_ID } from '../../../client-utils';
import { ItemsList, NotFound, extendWithLoader } from '../../../components';

const ItemsListWithLoader = extendWithLoader(ItemsList);

export const fetchCitiesData = (citiesState: ICityState, itemsState: IItemsState, city: string, dispatch) => {
  return getSelectedCity(citiesState, city)
    .then(({id}) => {
      dispatch(selectCity(id));
      const selectedCity = citiesState.dataMap[id];
      const allItemsLoaded = itemsState.allItemsLoaded;
      const isCityItemsLoaded = itemsState.itemsByCity[id];
      if (selectedCity && !allItemsLoaded && !isCityItemsLoaded) {
        return dispatch(getCityItems(id));
      }
    })
    .catch(console.error);
};

class CityPageComponent extends React.Component<any, any> {

  static fetchData(store, params) {
    const appState: IAppState = store.getState();
    const citiesState = appState.cities;
    const itemsState = appState.items;
    return fetchCitiesData(citiesState, itemsState, params.city, store.dispatch);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      fetchCitiesData(this.props.cities, this.props.items, this.props.match.params.city, this.props.dispatch);
    }
  }

  componentDidMount() {
    fetchCitiesData(this.props.cities, this.props.items, this.props.match.params.city, this.props.dispatch);
  }

  render() {
    const {selectedCity, selectedCityItems, itemsMap, typesMap} = this.props;

    if (selectedCity) {
      return (
        <div>
          <h1>{selectedCity.name}</h1>
          <p>{selectedCity.description}</p>
          <ItemsListWithLoader
            loaderId={CONTENT_LOADER_ID}
            items={selectedCityItems}
            itemsMap={itemsMap}
            typesMap={typesMap}
          />
        </div>
      );
    } else {
      return <NotFound/>;
    }
  }
}

const mapStateToProps = (state: IAppState) => {
  const selectedCityId = state.cities.selectedId;
  const selectedCityItems = state.items.itemsByCity[selectedCityId];
  return {
    selectedCity: state.cities.dataMap[selectedCityId],
    itemsMap: state.items.dataMap,
    selectedCityItems: selectedCityItems || [],
    typesMap: state.types.dataMap,
    cities: state.cities,
    items: state.items,
  };
};

export const CityPage = connect<any, any, {}>(mapStateToProps)(CityPageComponent);
