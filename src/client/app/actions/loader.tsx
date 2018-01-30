export const START_LOADING = 'START_LOADING';
export const END_LOADING = 'END_LOADING';
export const STOP_ALL_LOADERS = 'STOP_ALL_LOADERS';

export const startLoading = (id) => {
  return {
    type: START_LOADING,
    id,
  };
};

export const endLoading = (id) => {
  return {
    type: END_LOADING,
    id,
  };
};

export const stopAllLoaders = () => ({type: STOP_ALL_LOADERS});
