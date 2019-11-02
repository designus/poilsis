import * as React from 'react';
import { connect } from 'react-redux';

import { IAppState } from 'types';
import { loadCityItems } from 'actions/cities';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getLocalizedText, isDataEnabled } from 'client-utils/methods';
import { ItemsList } from 'components/itemsList';
import { NotFound } from 'components/notFound';
import { extendWithLoader } from 'components/extendWithLoader';
import { getCityByAlias, shouldLoadCityItems, getCityItems, getClientLocale } from 'selectors';
import { IMatchParams, ICityPageProps, ICityOwnProps, ICityStateProps, ICityDispatchProps } from './types';

const ItemsListWithLoader = extendWithLoader(ItemsList);

export const loadCityData = (store, params: IMatchParams) => store.dispatch(loadCityItems(params.cityAlias));

class CityPage extends React.Component<ICityPageProps, any> {

  componentDidUpdate(prevProps: ICityPageProps) {
    if (this.props.location !== prevProps.location && this.props.shouldLoadCityItems) {
      this.loadCityItems();
    }
  }

  componentDidMount() {
    if (this.props.shouldLoadCityItems) {
      this.loadCityItems();
    }
  }

  loadCityItems = () => {
    const { cityAlias } = this.props.match.params;
    this.props.loadCityItems(cityAlias);
  }

  render() {
    const { selectedCity, locale } = this.props;
    return isDataEnabled(selectedCity, locale) ? (
      <React.Fragment>
        <h1>{getLocalizedText(selectedCity.name, locale)}</h1>
        <p>{getLocalizedText(selectedCity.description, locale)}</p>
        <ItemsListWithLoader
          loaderId={CONTENT_LOADER_ID}
          items={this.props.cityItems}
          selectedCity={this.props.selectedCity}
        />
      </React.Fragment>
    ) : <NotFound/>;
  }
}

const mapStateToProps = (state: IAppState, props: ICityOwnProps) => ({
  selectedCity: getCityByAlias(state, props.match.params.cityAlias),
  cityItems: getCityItems(state, props.match.params.cityAlias),
  shouldLoadCityItems: shouldLoadCityItems(state, props.match.params.cityAlias),
  locale: getClientLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  loadCityItems: (cityAlias: string) => dispatch(loadCityItems(cityAlias))
});

export default connect<ICityStateProps, ICityDispatchProps, ICityOwnProps>(mapStateToProps, mapDispatchToProps)(CityPage);
