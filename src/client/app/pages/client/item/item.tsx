import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';

import { IAppState, IItemsState } from 'types';
import { IItem } from 'global-utils/typings';
import { loadItem } from 'actions/items';
import { NotFound } from 'components/notFound';
import { getItemByAlias } from 'selectors';
import { getLocalizedText, isItemEnabled } from 'client-utils/methods';

interface IMatchParams {
  locale: string;
  cityAlias: string;
  itemAlias: string;
}

interface IItemPageParams extends RouteComponentProps<IMatchParams> {
  items?: IItemsState;
  selectedItem?: IItem;
  loadItem?: (locale: string, alias: string) => void;
  selectItem?: (itemId: string) => void;
}

export const loadItemData = (store, params: IMatchParams) => store.dispatch(loadItem(params.locale, params.itemAlias));

class ItemPage extends React.Component<IItemPageParams, any> {

  componentDidMount() {
    const { selectedItem } = this.props;

    if (selectedItem && !selectedItem.isFullyLoaded) {
      this.loadItem();
    }
  }

  loadItem = () => {
    const { locale, itemAlias } = this.props.match.params;
    this.props.loadItem(locale, itemAlias);
  }

  createMarkup = (text: string) => {
    return {
      __html: text
    };
  }

  getLocalizedName = () => getLocalizedText(this.props.selectedItem.name, this.props.match.params.locale);

  renderTitle = () => {
    const localizedName = this.getLocalizedName();
    const localizedTitle = getLocalizedText(this.props.selectedItem.metaTitle, this.props.match.params.locale);
    return (
      <title>
        {localizedTitle || localizedName}
      </title>
    );
  }

  renderMetaDescription = () => {
    const { metaDescription } = this.props.selectedItem;
    return metaDescription && (
      <meta name="description" content={metaDescription[this.props.match.params.locale]} />
    );
  }

  render() {
    const { selectedItem } = this.props;
    const { locale } = this.props.match.params;

    return isItemEnabled(selectedItem, locale) ? (
      <React.Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          {this.renderTitle()}
          {this.renderMetaDescription()}
        </Helmet>
        <Typography variant="h1">
          {this.getLocalizedName()}
        </Typography>
        <div>{selectedItem.address}</div>
        <Typography variant="body1">
          <div dangerouslySetInnerHTML={
            this.createMarkup(getLocalizedText(selectedItem.description, locale))
          } />
        </Typography>
      </React.Fragment>
    ) : <NotFound /> ;
  }
}

const mapStateToProps = (state: IAppState, props: IItemPageParams) => ({
  selectedItem: getItemByAlias(state, props.match.params.itemAlias)
});

const mapDispatchToProps = (dispatch) => ({
  loadItem: (locale: string, alias: string) => dispatch(loadItem(locale, alias)),
});

export default connect<any, any, IItemPageParams>(mapStateToProps, mapDispatchToProps)(ItemPage);
