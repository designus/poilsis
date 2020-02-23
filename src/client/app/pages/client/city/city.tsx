import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
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
import { IMatchParams, Props, OwnProps, StateProps, Dispatch } from './types';
import { usePrevious } from 'client-utils/customHooks';
import { useStyles } from './styles';

const ItemsListWithLoader = extendWithLoader(ItemsList);

export const loadCityData = (store: any, params: IMatchParams) => store.dispatch(loadCityItems(params.cityAlias));

const CityPage: React.FunctionComponent<Props> = props => {
  const { selectedCity, locale, location, shouldLoadCityItems, cityItems } = props;
  const prevLocation = usePrevious(location);
  const classes = useStyles(props);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (location !== prevLocation && shouldLoadCityItems) {
      props.loadCityItems(props.match.params.cityAlias);
    }

  }, [props, prevLocation]);

  const getLocalizedName = () => getLocalizedText(selectedCity.name, locale);

  const renderTitle = () => {
    const localizedName = getLocalizedName();
    const localizedTitle = getLocalizedText(selectedCity.metaTitle, locale);
    return (
      <title>
        {localizedTitle || localizedName}
      </title>
    );
  };

  const renderMetaDescription = () => {
    return selectedCity.metaDescription && (
      <meta name="description" content={getLocalizedText(selectedCity.metaDescription, locale)} />
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
      {/* <Hidden smDown implementation="css">
      </Hidden> */}
      <div className={`${classes.left} ${matches ? classes.hidden : ''}`}>
        <LeftMenu />
      </div>
      <div className={classes.right}>
        <Typography className={classes.header} variant="h1">
          {getLocalizedName()}
        </Typography>
        <Typography variant="body1">
          {getLocalizedText(selectedCity.description, locale)}
        </Typography>
        <ItemsListWithLoader
          loaderId={CONTENT_LOADER_ID}
          items={cityItems}
          selectedCity={selectedCity}
        />
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
