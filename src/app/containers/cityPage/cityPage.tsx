import * as React from 'react';
import { connect } from 'react-redux';
import { asyncConnect} from 'redux-connect';
import { IAppState } from '../../reducers';
import { getItems, selectCity } from '../../actions';
import { getSelectedCity, ITEMS_LOADER_ID } from '../../helpers';
import { ItemsList, NotFound, extendWithLoader } from '../../components';

const ItemsListWithLoader = extendWithLoader(ItemsList);

@asyncConnect([{
  key: 'items',
  promise: ({params, store}) => {

    const appState: IAppState = store.getState();
    const citiesState = appState.cities;
    const itemsState = appState.items;
    const allItemsLoaded = itemsState.allItemsLoaded;

    return getSelectedCity(citiesState, params.city)
      .then(({id}) => {
        store.dispatch(selectCity(id));
        const selectedCity = citiesState.dataMap[id];
        if (selectedCity && !allItemsLoaded && !itemsState.itemsByCity[id]) {
          return store.dispatch(getItems(ITEMS_LOADER_ID, id));
        } else {
          return Promise.resolve();
        }
    }).catch((e) => {
      console.error('Err', e);
      return Promise.resolve();
    });
  },
}])
class CityPageComponent extends React.Component<any, any> {

  render() {

    const {selectedCity, cityItems, itemsMap, typesMap} = this.props;

    if (selectedCity) {
      return (
        <div>
          <h1>{selectedCity.name}</h1>
          <p>{selectedCity.description}</p>
          <ItemsListWithLoader
            loaderId={ITEMS_LOADER_ID}
            items={cityItems}
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
  return {
    selectedCity: state.cities.dataMap[selectedCityId],
    itemsMap: state.items.dataMap,
    cityItems: state.items.itemsByCity[selectedCityId] || [],
    typesMap: state.types.dataMap,
  };
};

export const CityPage = connect(mapStateToProps)(CityPageComponent);
