import { SELECT_ITEM, RECEIVE_ITEMS, RECEIVE_ITEM } from '../actions/items';
import { IGenericState } from '../helpers';

export interface IItemsMap {
  alias: string;
  city: string;
  createdAt: string;
  id: string;
  name: string;
  types: string[];
}

export interface IItemsState extends IGenericState<IItemsMap> {
  selectedId?: string;
  allItemsLoaded?: boolean;
}

const initialItemsState = {dataMap: {}, aliases: [], allItemsLoaded: false};

export const items = (state: IItemsState = initialItemsState, action): IItemsState => {
  switch (action.type) {
    case SELECT_ITEM:
      return {...state, selectedId: action.itemId};
    case RECEIVE_ITEMS:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          ...action.dataMap,
        },
        aliases: [ ...state.aliases, ...action.aliases ],
        allItemsLoaded: action.allItemsLoaded,
      };
    case RECEIVE_ITEM:
      const itemState = state.dataMap[action.item.id] || {};
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.item.id]: {
            ...itemState,
            ...action.item,
            fullInfo: true,
          },
        },
    };
    default:
      return state;
  }
};
