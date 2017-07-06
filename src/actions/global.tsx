export const START_REQUEST = 'START_REQUEST';
export const RESPONSE_SUCCESS = 'RESPONSE_SUCCESS';
export const RESPONSE_FAILURE = 'RESPONSE_FAILURE';

export const startRequest = () => {
  return {
    type: START_REQUEST
  }
}

export const responseSuccess = () => {
  return {
    type: RESPONSE_SUCCESS
  }
}

export const responseFailure = (payload) => {
  return {
    type: RESPONSE_FAILURE,
    payload
  }
}