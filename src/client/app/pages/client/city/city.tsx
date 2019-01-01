import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { IAppState, ICityState, IItemsState, ICity } from 'reducers';
import { loadCityItems, selectCity } from 'actions';
import { CONTENT_LOADER_ID } from 'client-utils';
import { ItemsList, NotFound, extendWithLoader } from 'components';
import { getSelectedCity } from 'selectors';

const ItemsListWithLoader = extendWithLoader(ItemsList);

interface IMatchParams {
  cityName: string;
  locale: string;
}

interface ICityPageParams extends RouteComponentProps<IMatchParams> {
  items: IItemsState;
  cities: ICityState;
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
  .then(({ id: cityId }) => Promise.all([
    dispatch(selectCity(cityId)),
    dispatch(loadCityItems(cityId, routeParams.locale)),
  ]))
  .catch(console.error);
};

class CityPageComponent extends React.Component<ICityPageParams, any> {

  static fetchData(store, params: IMatchParams) {
    const appState: IAppState = store.getState();
    return fetchCitiesData(appState.cities, params, store.dispatch);
  }

  componentDidUpdate(prevProps: ICityPageParams) {
    if (this.props.location !== prevProps.location) {
      fetchCitiesData(this.props.cities, this.props.match.params, this.props.dispatch);
    }
  }

  componentDidMount() {
    fetchCitiesData(this.props.cities, this.props.match.params, this.props.dispatch);
  }

  render() {
    const { selectedCity } = this.props;
    return selectedCity ? (
      <div>
        <h1>{selectedCity.name}</h1>
        <p>{selectedCity.description}</p>
        <ItemsListWithLoader loaderId={CONTENT_LOADER_ID} />
      </div>
    ) : <NotFound/>;
  }
}

const mapStateToProps = (state: IAppState) => ({
  selectedCity: getSelectedCity(state),
  cities: state.cities,
});

export const CityPage = connect<any, any, {}>(mapStateToProps)(CityPageComponent);
