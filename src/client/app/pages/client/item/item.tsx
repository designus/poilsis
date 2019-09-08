import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { IAppState, IItemsState } from 'types';
import { IItem } from 'global-utils/typings';
import { loadItem, selectItem, clearSelectedItem } from 'actions/items';
import { NotFound } from 'components/notFound';
import { getItemByAlias } from 'selectors';
import { getLocalizedText } from 'client-utils/methods';

interface IMatchParams {
  locale: string;
  cityAlias: string;
  itemAlias: string;
}

interface IItemPageParams extends RouteComponentProps<IMatchParams> {
  items?: IItemsState;
  selectedItem?: IItem;
  loadItem?: (alias: string) => void;
  selectItem?: (itemId: string) => void;
  clearSelectedItem?: () => void;
}

export const loadItemData = (store, params: IMatchParams) => store.dispatch(loadItem(params.itemAlias));

class ItemPage extends React.Component<IItemPageParams, any> {

  componentDidMount() {
    const { selectedItem } = this.props;

    if (selectedItem && !selectedItem.isFullyLoaded) {
      this.loadItem();
    }

    if (!selectedItem) {
      this.loadItem();
    }
  }

  componentWillUnmount() {
    this.props.clearSelectedItem();
  }

  loadItem = () => {
    const { itemAlias } = this.props.match.params;
    this.props.loadItem(itemAlias);
  }

  render() {
    const { selectedItem } = this.props;

    return selectedItem && selectedItem.isEnabled ? (
      <div>
        {getLocalizedText(selectedItem.name, this.props.match.params.locale)}<br />
        {selectedItem.address}<br />
      </div>
    ) : <NotFound /> ;
  }
}

const mapStateToProps = (state: IAppState, props: IItemPageParams) => ({
  selectedItem: getItemByAlias(state, props.match.params.itemAlias, props.match.params.locale)
});

const mapDispatchToProps = (dispatch) => ({
  loadItem: (alias: string) => dispatch(loadItem(alias)),
  selectItem: (itemId: string) => dispatch(selectItem(itemId)),
  clearSelectedItem: () => dispatch(clearSelectedItem())
});

export default connect<any, any, IItemPageParams>(mapStateToProps, mapDispatchToProps)(ItemPage);
