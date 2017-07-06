import {START_REQUEST, RESPONSE_SUCCESS, RESPONSE_FAILURE }  from '../actions';

const global = (state = {}, action) => {
  switch (action.type) {
    case START_REQUEST:
      return {...state, isLoading: true}
    case RESPONSE_SUCCESS:
      return {...state, isLoading: false}
    case RESPONSE_FAILURE:
      return {...state, isLoading: false, error: action.payload}
    default:
      return state;
  }
}

export default global;