import { ICityFields } from 'global-utils';
import { IGenericState, removeItemById, IGenericDataMap } from 'client-utils';
import {
  SELECT_CITY,
  RECEIVE_INITIAL_DATA,
  RECEIVE_CLIENT_CITY,
  CLEAR_SELECTED_CITY,
  REMOVE_CITY,
  CLEAR_STATE,
  RECEIVE_ITEMS,
} from 'actions';

export interface ICity extends ICityFields {
  hasItems: boolean;
}

export type ICitiesMap = IGenericDataMap<ICity>;

export interface ICityState extends IGenericState<ICity> {
  selectedId?: string;
}

const getInitialState = () => ({
  dataMap: {},
  aliases: [],
});

export const cities = (state: ICityState = getInitialState(), action): ICityState => {
  switch (action.type) {
    case CLEAR_STATE:
      return getInitialState();
    case SELECT_CITY:
      return {
        ...state,
        selectedId: action.cityId,
      };
    case CLEAR_SELECTED_CITY:
      return {
        ...state,
        selectedId: null,
      };
    case RECEIVE_ITEMS:
      return action.cityId ?
        {
          ...state,
          dataMap: {
            ...state.dataMap,
            [action.cityId]: {
              ...state.dataMap[action.cityId],
              hasItems: true,
            },
          },
        }
      : state;
    case RECEIVE_CLIENT_CITY:
      return {
        ...state,
        aliases: [
          ...state.aliases,
          { id: action.newCity.id, alias: action.newCity.alias },
        ],
        dataMap: {
          ...state.dataMap,
          [action.newCity.id]: {
            ...(state.dataMap[action.newCity.id] || {}),
            ...action.newCity,
          },
        },
      };
    case REMOVE_CITY:
      return {
        ...state,
        dataMap: removeItemById(action.cityId, state.dataMap),
        aliases: [...state.aliases.filter(alias => alias.id !== action.cityId)],
      };
    case RECEIVE_INITIAL_DATA:
      return {
        ...state,
        ...action.data.cities,
      };
    default:
      return state;
  }
};
