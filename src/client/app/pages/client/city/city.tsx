import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { ICity } from 'global-utils/typings';
import { IAppState } from 'reducers';
import { loadCityItems, clearSelectedCity } from 'actions/cities';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getLocalizedText } from 'client-utils/methods';
import { ItemsList } from 'components/itemsList';
import { NotFound } from 'components/notFound';
import { extendWithLoader } from 'components/extendWithLoader';
import { IItem } from 'global-utils/typings';
import { getSelectedCity, shouldLoadCityItems, getCityItems, getLocale } from 'selectors';

const ItemsListWithLoader = extendWithLoader(ItemsList);

interface IMatchParams {
  cityAlias: string;
  locale: string;
}

interface ICityPageParams extends RouteComponentProps<IMatchParams> {
  cityItems: IItem[];
  selectedCity: ICity;
  shouldLoadCityItems: boolean;
  locale: string;
  loadCityItems: (cityAlias: string, locale: string) => void;
  clearSelectedCity: () => void;
}

export const loadCityData = (store, params: IMatchParams) => store.dispatch(loadCityItems(params.cityAlias, params.locale));

class CityPage extends React.Component<ICityPageParams, any> {

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
    const { selectedCity, locale } = this.props;
    return selectedCity ? (
      <div>
        <h1>{getLocalizedText(selectedCity.name, locale)}</h1>
        <p>{getLocalizedText(selectedCity.description, locale)}</p>
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
  locale: getLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  loadCityItems: (cityAlias: string, locale: string) => dispatch(loadCityItems(cityAlias, locale)),
  clearSelectedCity: () => dispatch(clearSelectedCity())
});

export default connect<any, any, ICityPageParams>(mapStateToProps, mapDispatchToProps)(CityPage);
