import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { IAppState, IItemsState, IItem } from 'reducers';
import { loadItem, selectItem, clearItemSelection } from 'actions';
import { NotFound } from 'components';
import { getSelectedItem, shouldLoadViewItem } from 'selectors';

interface IMatchParams {
  itemAlias: string;
  cityName: string;
  locale: string;
}

interface IItemPageParams extends RouteComponentProps<IMatchParams> {
  items?: IItemsState;
  selectedItem?: IItem;
  loadItem?: (alias: string, locale: string) => void;
  selectItem?: (itemId: string) => void;
  clearItemSelection?: () => void;
  shouldLoadItem?: (state: IAppState) => boolean;
}

class ItemPageComponent extends React.Component<IItemPageParams, any> {

  static fetchData(store, params: IMatchParams) {
    return store.dispatch(loadItem(params.itemAlias, params.locale));
  }

  componentDidUpdate(prevProps: IItemPageParams) {
    if (this.props.match.params.itemAlias !== prevProps.match.params.itemAlias && this.props.shouldLoadItem) {
      this.loadItem();
    }
  }

  componentDidMount() {
    if (this.props.shouldLoadItem) {
      this.loadItem();
    }
  }

  componentWillUnmount() {
    this.props.clearItemSelection();
  }

  loadItem = () => {
    const { itemAlias, locale } = this.props.match.params;
    this.props.loadItem(itemAlias, locale);
  }

  render() {
    const { selectedItem } = this.props;

    return selectedItem && selectedItem.isEnabled ? (
      <div>
        {selectedItem.name}<br />
        {selectedItem.address}<br />
      </div>
    ) : <NotFound /> ;
  }
}

const mapStateToProps = (state: IAppState, props: IItemPageParams) => ({
  selectedItem: getSelectedItem(state, props.location.state),
  shouldLoadItem: shouldLoadViewItem(state, props.location.state),
});

const mapDispatchToProps = (dispatch) => ({
  loadItem: (alias: string, locale: string) => dispatch(loadItem(alias, locale)),
  selectItem: (itemId: string) => dispatch(selectItem(itemId)),
  clearItemSelection: () => dispatch(clearItemSelection()),
});

export const ItemPage = connect<any, any, IItemPageParams>(mapStateToProps, mapDispatchToProps)(ItemPageComponent);
