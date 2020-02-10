import * as React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';

import { IAppState, ThunkDispatch } from 'types';
import { getClientItem } from 'actions/items';
import { NotFound } from 'components/notFound';
import { getItemByAlias, getCitiesMap } from 'selectors';
import { getLocalizedText, isItemEnabled } from 'client-utils/methods';
import { MatchParams, OwnProps, StateProps, DispatchProps, ItemPageProps } from './types';

export const loadItemData = (store: any, params: MatchParams) => store.dispatch(getClientItem(params.locale, params.itemAlias));

const { useEffect } = React;

const ItemPage: React.FunctionComponent<ItemPageProps> = props => {
  const { selectedItem, match, getClientItem, citiesMap } = props;
  const { locale, itemAlias } = match.params;

  useEffect(() => {
    if (selectedItem && !selectedItem.isFullyLoaded) {
      getClientItem(locale, itemAlias);
    }
  }, [selectedItem, getClientItem]);

  if (!selectedItem) {
    return (
      <NotFound />
    );
  }

  const createMarkup = (text: string) => {
    return {
      __html: text
    };
  };

  const getLocalizedName = () => getLocalizedText(selectedItem.name, locale);

  const renderTitle = () => {
    const localizedName = getLocalizedName();
    const localizedTitle = getLocalizedText(selectedItem.metaTitle, locale);
    return (
      <title>
        {localizedTitle || localizedName}
      </title>
    );
  };

  const renderMetaDescription = () => {
    return selectedItem.metaDescription && (
      <meta name="description" content={getLocalizedText(selectedItem.metaDescription, locale)} />
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

  return isItemEnabled(selectedItem, citiesMap[selectedItem.cityId], locale) ? (
    <React.Fragment>
      {renderDocumentHead()}
      <Typography variant="h1">
        {getLocalizedName()}
      </Typography>
      <div>{selectedItem.address}</div>
      <Typography variant="body1">
        <div dangerouslySetInnerHTML={
          createMarkup(getLocalizedText(selectedItem.description, locale))
        } />
      </Typography>
    </React.Fragment>
  ) : <NotFound /> ;
};

const mapStateToProps = (state: IAppState, props: OwnProps): StateProps => ({
  selectedItem: getItemByAlias(state, props.match.params.itemAlias),
  citiesMap: getCitiesMap(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): DispatchProps => ({
  getClientItem: (locale, alias) => dispatch(getClientItem(locale, alias))
});

export default connect<StateProps, DispatchProps, OwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(ItemPage);
