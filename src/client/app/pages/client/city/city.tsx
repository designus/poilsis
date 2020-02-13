import * as React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';

import { IAppState } from 'types';
import { loadCityItems } from 'actions/cities';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getLocalizedText, isDataEnabled } from 'client-utils/methods';
import { ItemsList } from 'components/itemsList';
import { NotFound } from 'components/notFound';
import { extendWithLoader } from 'components/extendWithLoader';
import { getCityByAlias, shouldLoadCityItems, getCityItems, getClientLocale } from 'selectors';
import { IMatchParams, ICityPageProps, IOwnProps, IStateProps, IDispatchProps } from './types';

const ItemsListWithLoader = extendWithLoader(ItemsList);

export const loadCityData = (store: any, params: IMatchParams) => store.dispatch(loadCityItems(params.cityAlias));

class CityPage extends React.Component<ICityPageProps> {

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

  getLocalizedName = () => getLocalizedText(this.props.selectedCity.name, this.props.locale);

  renderTitle = () => {
    const localizedName = this.getLocalizedName();
    const localizedTitle = getLocalizedText(this.props.selectedCity.metaTitle, this.props.locale);
    return (
      <title>
        {localizedTitle || localizedName}
      </title>
    );
  }

  renderMetaDescription = () => {
    const { metaDescription } = this.props.selectedCity;
    return metaDescription && (
      <meta name="description" content={getLocalizedText(metaDescription, this.props.locale)} />
    );
  }

  renderDocumentHead = () => {
    return (
      <Helmet>
        {this.renderTitle()}
        {this.renderMetaDescription()}
      </Helmet>
    );
  }

  render() {
    const { selectedCity, locale } = this.props;
    return isDataEnabled(selectedCity, locale) ? (
      <div style={{ height: '100%', width: '100%' }}>
        {this.renderDocumentHead()}
        <Typography variant="h1">
          {this.getLocalizedName()}
        </Typography>
        <Typography variant="body1">
          {getLocalizedText(selectedCity.description, locale)}
        </Typography>
        <ItemsListWithLoader
          loaderId={CONTENT_LOADER_ID}
          items={this.props.cityItems}
          selectedCity={this.props.selectedCity}
        />
      </div>
    ) : <NotFound/>;
  }
}

const mapStateToProps = (state: IAppState, props: IOwnProps): IStateProps => ({
  selectedCity: getCityByAlias(state, props.match.params.cityAlias),
  cityItems: getCityItems(state, props.match.params.cityAlias),
  shouldLoadCityItems: shouldLoadCityItems(state, props.match.params.cityAlias),
  locale: getClientLocale(state)
});

const mapDispatchToProps = {
  loadCityItems
};

export default connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(CityPage);
