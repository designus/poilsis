import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { IAppState, IItemsState, IItem } from 'reducers';
import { loadItem, selectItem, clearSelectedItem } from 'actions';
import { NotFound } from 'components/notFound';
import { getSelectedItem, shouldLoadViewItem } from 'selectors';

interface IMatchParams {
  locale: string;
  cityAlias: string;
  itemAlias: string;
}

interface IItemPageParams extends RouteComponentProps<IMatchParams> {
  items?: IItemsState;
  selectedItem?: IItem;
  loadItem?: (alias: string, locale: string) => void;
  selectItem?: (itemId: string) => void;
  clearSelectedItem?: () => void;
  shouldLoadItem?: (state: IAppState) => boolean;
}

export const loadItemData = (store, params: IMatchParams) => store.dispatch(loadItem(params.itemAlias, params.locale));

class ItemPage extends React.Component<IItemPageParams, any> {

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
    this.props.clearSelectedItem();
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
  clearSelectedItem: () => dispatch(clearSelectedItem()),
});

export default connect<any, any, IItemPageParams>(mapStateToProps, mapDispatchToProps)(ItemPage);
