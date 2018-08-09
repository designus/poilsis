export const START_LOADING = 'START_LOADING';
export const END_LOADING = 'END_LOADING';
export const STOP_ALL_LOADERS = 'STOP_ALL_LOADERS';

export const startLoading = (id) => ({
  type: START_LOADING,
  id,
});

export const endLoading = (id) => ({
  type: END_LOADING,
  id,
});
