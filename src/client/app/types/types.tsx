import { IType } from 'global-utils/typings';
import { IGenericDataMap, IGenericState, IToggleEnabled } from './generic';

export type ITypesMap = IGenericDataMap<IType>;
export interface ITypesState extends IGenericState<IType> {
  selectedId?: string;
}

export enum TypesActionTypes {
  SELECT_TYPE = 'SELECT_TYPE',
  RECEIVE_TYPE = 'RECEIVE_TYPE',
  REMOVE_TYPE = 'REMOVE_TYPE',
  TOGGLE_TYPE_ENABLED = 'TOGGLE_TYPE_ENABLED'
}

export interface ISelectType {
  type: TypesActionTypes.SELECT_TYPE;
  typeId: string;
}

export interface IReceiveType {
  type: TypesActionTypes.RECEIVE_TYPE;
  newType: IType;
}

export interface IRemoveType {
  type: TypesActionTypes.REMOVE_TYPE;
  typeId: string;
}

export type TypesActions =
  | ISelectType
  | IReceiveType
  | IRemoveType
  | IToggleEnabled;
