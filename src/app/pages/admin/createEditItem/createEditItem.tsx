import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from 'reducers';
import { getItem, putItem } from 'actions';
import { extendWithForm } from 'components';
import { itemModel } from 'pages';
import { getFormStateWithData, getInitialFormState, getBackendErrors, ITEM_LOADER_ID } from 'helpers';
import { CreateEditItem } from './itemForm';

const ItemForm = extendWithForm(CreateEditItem);
const CREATE_EDIT_ITEM_LOADER = 'createEditItem';

class CreateEditItemPageComponent extends React.Component<any, any> {

  state = getInitialFormState(itemModel);
  isCreatePage = !Boolean(this.props.params.id);

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getItem(this.props.params.id);
  }

  onItemSubmit = (item) => {
    if (this.isCreatePage) {
      this.setState(getInitialFormState(itemModel));
    } else {
      this.props.putItem(item).then((errors) => {
        if (errors) {
          const newErrors = {...this.state.errors, ...getBackendErrors(errors)};
          this.setState({errors: newErrors, showErrors: true});
        }
      });
    }

  }

  render() {

    const loadedItem = this.props.itemsMap[this.props.params.id];
    const finalState = loadedItem && getFormStateWithData(loadedItem, this.state) || this.state;

    if (loadedItem || this.isCreatePage) {

      return (
        <ItemForm
          loaderId={CREATE_EDIT_ITEM_LOADER}
          onItemSubmit={this.onItemSubmit}
          initialState={finalState}
          citiesMap={this.props.citiesMap}
          typesMap={this.props.typesMap}
        />
      );
    } else {
      return null;
    }
  }
};

const mapStateToProps = (state: IAppState) => {
  return {
    itemsMap: state.items.dataMap,
    citiesMap: state.cities.dataMap,
    typesMap: state.types.dataMap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getItem: (itemId) => dispatch(getItem(itemId, ITEM_LOADER_ID)),
    putItem: (item) => dispatch(putItem(item, ITEM_LOADER_ID)),
  };
};

export const CreateEditItemPage = connect(mapStateToProps, mapDispatchToProps)(CreateEditItemPageComponent);
