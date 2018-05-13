import { RECEIVE_USER_ITEMS, RECEIVE_USER_DETAILS, REMOVE_USER_ITEM } from '../actions';

export interface IUser {
  name: string;
  role: string;
  id: string;
}

export interface IUserState {
  details: IUser;
  items: string[];
}

export const user = (state: IUserState = { details: null, items: [] }, action): IUserState => {
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
