import * as React from 'react';
import * as autoBind from 'react-autobind';

import { connect } from 'react-redux';
import { extendWithForm } from '../../../components';
import { addNewItemState, postItem, showBackendValidationErrors, clearFields } from '../../../actions';
import { IGenericFormState, TGenericFormModel, IImage, getKeyMap, getMergedErrors, required, minLength, maxLength } from '../../../helpers';
import { CreateItem } from './itemForm';

import {
  NAME_LABEL,
  CITY_LABEL,
  TYPES_LABEL,
  ADDRESS_LABEL,
  DESCRIPTION_LABEL,
  IMAGES_LABEL,
} from '../../../data-strings';

export interface INewItemFields {
  id?: string;
  address?: string;
  city?: string;
  description?: string;
  name?: string;
  types?: string[];
  images?: IImage[];
}

export type TItemState = IGenericFormState<INewItemFields>;
export type TItemModel = TGenericFormModel<INewItemFields>;

export const itemModel: TItemModel = {
  id: getKeyMap('', 'id', []),
  name: getKeyMap('', NAME_LABEL, [required, minLength(6)]),
  city: getKeyMap('', CITY_LABEL, [required]),
  types: getKeyMap([], TYPES_LABEL, [required, minLength(1, true), maxLength(3, true)]),
  address: getKeyMap('', ADDRESS_LABEL, []),
  description: getKeyMap('', DESCRIPTION_LABEL, []),
  images: getKeyMap([], IMAGES_LABEL, [maxLength(6, true)]),
};

const ItemForm = extendWithForm(CreateItem);
const ADD_ITEM_LOADER = 'addItem';

class AddItemPageComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);
    autoBind(this);
  }

  onItemSubmit(item) {
    this.props.postItem(item, ADD_ITEM_LOADER).then((errors) => {
      if (errors) {
        const validationErrors = getMergedErrors(errors, this.props.initialState.errors);
        this.props.showBackendErrors(validationErrors);
      } else {
        this.props.clearFormFields();
      }
    });
  }

  onSaveState(state) {
    this.props.addNewItemState(state);
  }

  render() {
    return (
      <div>
        <h1>Post your ad</h1>
        <ItemForm
          loaderId={ADD_ITEM_LOADER}
          onSaveState={this.onSaveState}
          onItemSubmit={this.onItemSubmit}
          {...this.props}
        />
      </div>
    );
  }
}

export const mapStateToProps = (state) => {
  return {
    initialState: state.newItem,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    addNewItemState: (state) => dispatch(addNewItemState(state)),
    postItem: (item, loaderId) => dispatch(postItem(item, loaderId)),
    showBackendErrors: (errors) => dispatch(showBackendValidationErrors(errors)),
    clearFormFields: () => dispatch(clearFields()),
  };
};

export const AddItemPage = connect(mapStateToProps, mapDispatchToProps)(AddItemPageComponent);
