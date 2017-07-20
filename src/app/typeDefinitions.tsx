export interface IAlias {
	alias: string;
	id: string;
}

export type ValueType = string|string[];

export interface IKeyMap {
	value: ValueType;
	title: string;
	validators: Array<() => void>;
}
