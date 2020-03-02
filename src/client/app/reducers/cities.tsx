import { Reducer } from 'redux';
import { removeByKeys, getAliasKeysById, getAliasState } from 'client-utils/methods';
import { ICityFilters } from 'global-utils/typings';
import {
  ItemsActions,
  ICityState,
  CitiesActionTypes,
  CitiesActions,
  InitialDataActionTypes,
  InitialDataActions
} from 'types';

type ActionTypes = CitiesActions | ItemsActions | InitialDataActions;

export const getInitialCitiesState = (): ICityState => ({
  dataMap: {},
  aliases: {}
});

const getInitialFiltersState = (): ICityFilters => ({
  type: 'all',
  price: []
});

export const cities: Reducer<ICityState, ActionTypes> = (state: ICityState = getInitialCitiesState(), action): ICityState => {
  switch (action.type) {
    case CitiesActionTypes.SET_CITY_ITEMS:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.cityId]: {
            ...state.dataMap[action.cityId],
            hasItems: true,
            filters: getInitialFiltersState()
          }
        }
      };
    case CitiesActionTypes.RECEIVE_CITY:
      return {
        ...state,
        aliases: {
          ...state.aliases,
          ...getAliasState(action.city.alias, action.city.id)
        },
        dataMap: {
          ...state.dataMap,
          [action.city.id]: {
            ...(state.dataMap[action.city.id] || {}),
            ...action.city,
            isFullyLoaded: true
          }
        }
      };
    case CitiesActionTypes.REMOVE_CITY:
      return {
        ...state,
        dataMap: removeByKeys([action.cityId], state.dataMap),
        aliases: removeByKeys(getAliasKeysById(state, action.cityId), state.aliases)
      };
    case CitiesActionTypes.TOGGLE_CITY_ENABLED:
      return {
        ...state,
        dataMap: {
          ...state.dataMap,
          [action.id]: {
            ...state.dataMap[action.id],
            isEnabled: {
              ...state.dataMap[action.id].isEnabled,
              [action.locale]: action.isEnabled
            }
          }
        }
      };
    case InitialDataActionTypes.RECEIVE_INITIAL_DATA:
      return {
        ...state,
        ...action.cities
      };
    default:
      return state;
  }
};
