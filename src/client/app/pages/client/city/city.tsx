import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState, ICityState } from '../../../reducers';
import { getCityItems, selectCity } from '../../../actions';
import { getSelectedCity, CONTENT_LOADER_ID } from '../../../client-utils';
import { ItemsList, NotFound, extendWithLoader } from '../../../components';

const ItemsListWithLoader = extendWithLoader(ItemsList);

export const fetchCitiesData = (citiesState: ICityState, cityAlias: string, dispatch) => {
  return getSelectedCity(citiesState, cityAlias)
    // We return promise, so it can be consumed syncroniously on server side
    .then(({id: cityId}) => Promise.all([dispatch(selectCity(cityId)), dispatch(getCityItems(cityId))]))
    .catch(console.error);
};

class CityPageComponent extends React.Component<any, any> {

  static fetchData(store, params) {
    const appState: IAppState = store.getState();
    const citiesState = appState.cities;
    return fetchCitiesData(citiesState, params.city, store.dispatch);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      fetchCitiesData(this.props.cities, this.props.match.params.city, this.props.dispatch);
    }
  }

  componentDidMount() {
    fetchCitiesData(this.props.cities, this.props.match.params.city, this.props.dispatch);
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
  const {cities, items, types} = state;
  const selectedCityId = cities.selectedId;
  const selectedCityItems = items.itemsByCity[selectedCityId];
  return {
    selectedCity: cities.dataMap[selectedCityId],
    itemsMap: items.dataMap,
    selectedCityItems: selectedCityItems && selectedCityItems.list || [],
    typesMap: types.dataMap,
    cities,
    items,
  };
};

export const CityPage = connect<any, any, {}>(mapStateToProps)(CityPageComponent);
