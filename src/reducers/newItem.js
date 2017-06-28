import {ADD_NEW_ITEM_STATE, CLEAR_FIELDS} from '../actions';
import {newItemModel} from '../components/addItemForm';
import mapValues from 'lodash/mapValues';

export const FIELD_VALUES = 'fields';
export const VALIDATION_ERRORS = 'errors';
export const SHOW_VALIDATION_ERRORS = 'showErrors';

export const initialNewItemState = {
  [FIELD_VALUES]: mapValues(newItemModel, (item) => item.value),
  [VALIDATION_ERRORS]: {},
  [SHOW_VALIDATION_ERRORS]: false
};

export const newItem = (state = initialNewItemState, action) => {
  switch(action.type) {
    case ADD_NEW_ITEM_STATE:
      return action.state;
      break;
    case CLEAR_FIELDS:
      return initialNewItemState;
    default:
      return state;
  }
}