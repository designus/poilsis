import { Reducer } from 'redux';
import { removeItemById } from 'client-utils/methods';
import {
  ItemsActionTypes,
  ItemsActions,
  ICityState,
  CitiesActionTypes,
  CitiesActions,
  InitialDataActionTypes,
  InitialDataActions
} from 'types';

type ActionTypes = CitiesActions | ItemsActions | InitialDataActions;

const getInitialState = (): ICityState => ({
  dataMap: {},
  aliases: []
});

export const cities: Reducer<ICityState, ActionTypes> = (state: ICityState = getInitialState(), action): ICityState => {
  switch (action.type) {
    case InitialDataActionTypes.CLEAR_STATE:
      return getInitialState();
    case CitiesActionTypes.SELECT_CITY:
      return {
        ...state,
        selectedId: action.cityId
      };
    case CitiesActionTypes.CLEAR_SELECTED_CITY:
      return {
        ...state,
        selectedId: null
      };
    case ItemsActionTypes.RECEIVE_ITEMS:
      return action.cityId ?
        {
          ...state,
          dataMap: {
            ...state.dataMap,
            [action.cityId]: {
              ...state.dataMap[action.cityId],
              hasItems: true
            }
          }
        }
      : state;
    case CitiesActionTypes.RECEIVE_CITY:
      return {
        ...state,
        aliases: [
          ...state.aliases,
          {
            id: action.city.id,
            alias: action.city.alias
          }
        ],
        dataMap: {
          ...state.dataMap,
          [action.city.id]: {
            ...(state.dataMap[action.city.id] || {}),
            ...action.city
          }
        }
      };
    case CitiesActionTypes.REMOVE_CITY:
      return {
        ...state,
        dataMap: removeItemById(action.cityId, state.dataMap),
        aliases: [...state.aliases.filter(alias => alias.id !== action.cityId)]
      };
    case InitialDataActionTypes.RECEIVE_INITIAL_DATA:
      return {
        ...state,
        ...action.data.cities
      };
    default:
      return state;
  }
};
