import { RECEIVE_USER_ITEMS, RECEIVE_USER_DETAILS, REMOVE_USER_ITEM } from '../actions';

export interface ICurrentUser {
  name: string;
  role: string;
  id: string;
}

export interface ICurrentUserState {
  details: ICurrentUser;
  items: string[];
  isAllLoaded?: boolean;
}

export const currentUser = (state: ICurrentUserState = { details: null, items: [] }, action): ICurrentUserState => {
  switch (action.type) {
    case RECEIVE_USER_DETAILS: {
      return {
        ...state,
        details: action.userDetails,
      };
    }
    case RECEIVE_USER_ITEMS: {
      return {
        ...state,
        items: action.userItems,
        isAllLoaded: true,
      };
    }
    case REMOVE_USER_ITEM: {
      return {
        ...state,
        items: state.items.filter(itemId => itemId !== action.itemId),
      };
    }
    default:
      return state;
  }
};
