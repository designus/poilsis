import { RECEIVE_USER_ITEMS, RECEIVE_USER_DETAILS, REMOVE_ITEM, LOGOUT_SUCCESS } from '../actions';

export interface ICurrentUser {
  name?: string;
  role?: string;
  id?: string;
}

export interface ICurrentUserState {
  details: ICurrentUser;
  items: string[];
  isAllLoaded?: boolean;
}

const getInitialState = () => ({
  details: {},
  items: [],
  isAllLoaded: false,
});

export const currentUser = (state: ICurrentUserState = getInitialState(), action): ICurrentUserState => {
  switch (action.type) {
    case RECEIVE_USER_DETAILS: {
      return {
        ...state,
        details: action.userDetails,
      };
    }
    case LOGOUT_SUCCESS: {
      return getInitialState();
    }
    case RECEIVE_USER_ITEMS: {
      return {
        ...state,
        items: action.userItems,
        isAllLoaded: true,
      };
    }
    case REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(itemId => itemId !== action.item.id),
      };
    }
    default:
      return state;
  }
};
