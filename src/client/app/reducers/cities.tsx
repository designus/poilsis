import { Reducer } from 'redux';
import { ICity } from 'global-utils';
import { IGenericState, IGenericDataMap } from 'types/generic';
import { ItemsActionTypes, ItemsActions } from 'types/items';
import { removeItemById } from 'client-utils/methods';
import { CitiesActionTypes, CitiesActions } from 'actions/cities';
import { InitialDataActionTypes, InitialDataActions } from 'actions/initialData';

type ActionTypes = CitiesActions | ItemsActions | InitialDataActions;

export type ICitiesMap = IGenericDataMap<ICity>;
export interface ICityLocalized extends ICity<string> {}
export interface ICityState extends IGenericState<ICity> {
  selectedId?: string;
}

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
