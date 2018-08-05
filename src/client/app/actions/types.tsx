export const SELECT_TYPE = 'SELECT_TYPE';
export const RECEIVE_TYPE = 'RECEIVE_TYPE';
export const REMOVE_TYPE = 'REMOVE_TYPE';

export const selectType = (typeId) => ({
  type: SELECT_TYPE,
  typeId,
});
