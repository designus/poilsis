import {START_LOADING, END_LOADING} from '../actions';

export interface ILoadingState {
	[key: string]: {
		isLoading: boolean,
	};
}

export const loader = (state: ILoadingState = {}, action) => {
	switch (action.type) {
		case START_LOADING:
			return {
				...state,
				[action.id]: {
					isLoading: true,
				},
			};
		case END_LOADING:
			return {
				...state,
				[action.id]: {
					isLoading: false,
				},
			};
		default:
			return state;
	}
};
