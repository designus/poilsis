import { Type } from 'global-utils/data-models';
import { IGenericDataMap, IGenericState } from './generic';
import { selectType, receiveType, removeType, toggleTypeEnabledField } from 'actions/types';

export type ITypesMap = IGenericDataMap<Type>;

export interface ITypesState extends IGenericState<Type> {
  selectedId?: string;
}

export enum TypesActionTypes {
  SELECT_TYPE = 'SELECT_TYPE',
  RECEIVE_TYPE = 'RECEIVE_TYPE',
  REMOVE_TYPE = 'REMOVE_TYPE',
  TOGGLE_TYPE_ENABLED = 'TOGGLE_TYPE_ENABLED'
}

export type TypesActions =
  | ReturnType<typeof selectType>
  | ReturnType<typeof receiveType>
  | ReturnType<typeof removeType>
  | ReturnType<typeof toggleTypeEnabledField>;
