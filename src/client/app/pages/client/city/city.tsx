import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { IAppState, IItem, ICity } from 'reducers';
import { loadCityItems, clearSelectedCity } from 'actions';
import { CONTENT_LOADER_ID } from 'client-utils';
import { ItemsList, NotFound, extendWithLoader } from 'components';
import { getSelectedCity, shouldLoadCityItems, getCityItems } from 'selectors';

const ItemsListWithLoader = extendWithLoader(ItemsList);

interface IMatchParams {
  cityAlias: string;
  locale: string;
}

interface ICityPageParams extends RouteComponentProps<IMatchParams> {
  cityItems: IItem[];
  selectedCity: ICity;
  shouldLoadCityItems: boolean;
  loadCityItems: (cityAlias: string, locale: string) => void;
  clearSelectedCity: () => void;
}

class CityPageComponent extends React.Component<ICityPageParams, any> {

  static fetchData(store, params: IMatchParams) {
    return store.dispatch(loadCityItems(params.cityAlias, params.locale));
  }

  componentDidUpdate(prevProps: ICityPageParams) {
    if (this.props.location !== prevProps.location && this.props.shouldLoadCityItems) {
      this.loadCityItems();
    }
  }

  componentDidMount() {
    if (this.props.shouldLoadCityItems) {
      this.loadCityItems();
    }
  }

  componentWillUnmount() {
    this.props.clearSelectedCity();
  }

  loadCityItems = () => {
    const { cityAlias, locale } = this.props.match.params;
    this.props.loadCityItems(cityAlias, locale);
  }

  render() {
    const { selectedCity } = this.props;
    return selectedCity ? (
      <div>
        <h1>{selectedCity.name}</h1>
        <p>{selectedCity.description}</p>
        <ItemsListWithLoader
          loaderId={CONTENT_LOADER_ID}
          items={this.props.cityItems}
          selectedCity={this.props.selectedCity}
        />
      </div>
    ) : <NotFound/>;
  }
}

const mapStateToProps = (state: IAppState, props: ICityPageParams) => ({
  selectedCity: getSelectedCity(state, props.location.state),
  cityItems: getCityItems(state, props.location.state),
  shouldLoadCityItems: shouldLoadCityItems(state, props.location.state),
});

const mapDispatchToProps = (dispatch) => ({
  loadCityItems: (cityAlias: string, locale: string) => dispatch(loadCityItems(cityAlias, locale)),
  clearSelectedCity: () => dispatch(clearSelectedCity()),
});

export const CityPage = connect<any, any, ICityPageParams>(mapStateToProps, mapDispatchToProps)(CityPageComponent);
