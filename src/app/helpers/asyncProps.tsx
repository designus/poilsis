import { getInitialData } from '../actions';

export const initialDataProps = {
	key: 'initial',
	promise: ({params, store}) => {
		const appState = store.getState();
		if (appState.initialData.isLoaded) {
			return Promise.resolve();
		} else {
			return store.dispatch(getInitialData());
		}
	},
};
