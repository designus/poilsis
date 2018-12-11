export const START_LOADING = 'START_LOADING';
export const END_LOADING = 'END_LOADING';
export const STOP_ALL_LOADERS = 'STOP_ALL_LOADERS';

export const startLoading = (id: string) => ({
  type: START_LOADING,
  id,
});

export const endLoading = (id?: string) => ({
  type: END_LOADING,
});
