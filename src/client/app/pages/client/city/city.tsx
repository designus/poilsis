import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { IAppState } from 'types';
import { loadCityItems } from 'actions/cities';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getLocalizedText, isDataEnabled } from 'client-utils/methods';
import { ItemsList } from 'components/itemsList';
import { NotFound } from 'components/notFound';
import { ClientLeftMenu as LeftMenu } from 'components/menu';
import { extendWithLoader } from 'components/extendWithLoader';
import { getCityByAlias, shouldLoadCityItems, getCityItems, getClientLocale } from 'selectors';
import { usePrevious } from 'client-utils/customHooks';
import { Filters } from './filters';
import { MatchParams, Props, OwnProps, StateProps, Dispatch } from './types';
import { useStyles } from './styles';

const ItemsListWithLoader = extendWithLoader(ItemsList);

export const loadCityData = (store: any, params: MatchParams) => {
  const [cityAlias] = params.cityAlias.split('?');
  return store.dispatch(loadCityItems(cityAlias));
};

const CityPage: React.FunctionComponent<Props> = props => {
  const { selectedCity, locale, location, shouldLoadCityItems, cityItems } = props;
  const prevLocation = usePrevious(location);
  const classes = useStyles(props);
  const theme = useTheme();
  const isMobileWidth = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (location !== prevLocation && shouldLoadCityItems) {
      props.loadCityItems(props.match.params.cityAlias);
    }

  }, [props, prevLocation]);

  const getLocalizedName = () => getLocalizedText(locale, selectedCity.name);

  const renderTitle = () => {
    const localizedName = getLocalizedName();
    const localizedTitle = getLocalizedText(locale, selectedCity.metaTitle);
    return (
      <title>
        {localizedTitle || localizedName}
      </title>
    );
  };

  const renderMetaDescription = () => {
    return selectedCity.metaDescription && (
      <meta name="description" content={getLocalizedText(locale, selectedCity.metaDescription)} />
    );
  };

  const renderDocumentHead = () => {
    return (
      <Helmet>
        {renderTitle()}
        {renderMetaDescription()}
      </Helmet>
    );
  };

  return isDataEnabled(selectedCity, locale) ? (
    <div className={classes.wrapper}>
      {renderDocumentHead()}
      <Filters cityId={selectedCity.id} />
      <div className={classes.content}>
        <div className={`${classes.left} ${isMobileWidth ? classes.hidden : ''}`}>
          <LeftMenu />
        </div>
        <div className={classes.right}>
          <Typography className={classes.header} variant="h1">
            {getLocalizedName()}
          </Typography>
          <Typography variant="body1">
            {getLocalizedText(locale, selectedCity.description)}
          </Typography>
          <ItemsListWithLoader
            loaderId={CONTENT_LOADER_ID}
            items={cityItems}
            selectedCity={selectedCity}
          />
        </div>
      </div>
    </div>
  ) : <NotFound/>;
};

const mapStateToProps = (state: IAppState, props: OwnProps): StateProps => ({
  selectedCity: getCityByAlias(state, props.match.params.cityAlias),
  cityItems: getCityItems(state, props.match.params.cityAlias),
  shouldLoadCityItems: shouldLoadCityItems(state, props.match.params.cityAlias),
  locale: getClientLocale(state)
});

const mapDispatchToProps = {
  loadCityItems
};

export default connect<StateProps, Dispatch, OwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(CityPage);
