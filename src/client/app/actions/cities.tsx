export const SELECT_CITY = 'SELECT_CITY';

export const selectCity = (id) => {
  return {
    type: SELECT_CITY,
    cityId: id,
  };
};
