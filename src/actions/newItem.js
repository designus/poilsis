import axios from 'axios';
import { startRequest, responseSuccess, responseFailure } from './global';
import { receiveItem } from './items';
import { addItemToCity } from './cities';

export const ADD_NEW_ITEM_STATE = 'ADD_NEW_ITEM_STATE';
export const CLEAR_FIELDS = 'CLEAR_FIELDS';
export const RECEIVE_NEW_ITEM = 'RECEIVE_ITEM';
export const SHOW_BACKEND_VALIDATION_ERRORS = 'SHOW_BACKEND_VALIDATION_ERRORS';

export const addNewItemState = (state) => {
  return {
    type: ADD_NEW_ITEM_STATE,
    state
  }
}

export const clearFields = () => {
  return {
    type: CLEAR_FIELDS
  }
}

export const showBackendValidationErrors = (errors) => {
  return {
    type: SHOW_BACKEND_VALIDATION_ERRORS,
    errors
  }
}

export const getMergedErrors = (backendErrors, frontendErrors) => {
  return Object.keys(frontendErrors).reduce((acc, field) => {

    const fieldErrors = backendErrors[field] 
    ? [...frontendErrors[field], backendErrors[field].message] 
    : frontendErrors[field]
    
    return {...acc, [field]: fieldErrors }
  }, {})
} 

export const postItem = (item) => {

  return (dispatch, getState) => {
    dispatch(startRequest());
    
    return axios.post('http://localhost:3000/api/items', item)
      .then(item => item.data)
      .then(item => {
        if (item.errors) {
          console.log('Item errors', item.errors);
          const validationErrors = getMergedErrors(item.errors, getState().newItem.errors);
          console.log('Validation errors', validationErrors);
          dispatch(showBackendValidationErrors(validationErrors));
        } else {
          console.log('New added city', item);

          dispatch(receiveItem(item))
          dispatch(addItemToCity(item.city, item.id))
          dispatch(clearFields());
          dispatch(responseSuccess());
        }
        
      })
      .catch(err => {
        console.error(err);
        dispatch(responseFailure(err));
      })

  }
}