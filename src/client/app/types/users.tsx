import { IUser } from 'global-utils/typings';
import { IGenericDataMap, IGenericState } from './generic';

export type IUsersMap = IGenericDataMap<IUser>;
export interface IUsersState extends IGenericState<IUser> {}
