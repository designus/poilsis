import * as React from 'react';
import { IGenericDataMap } from '../../helpers';

export interface ISelectOptionProps {
	data?: any[]|IGenericDataMap<object>;
	dataKey?: string;
	label?: string;
	value?: string;
	onChange?: any;
}

export function SelectOptions({data, label = 'select', dataKey = 'name', value, onChange}: ISelectOptionProps) {

	const isDataArray = data.constructor === Array;
	const dataList: any = isDataArray ? data : Object.keys(data);
	const options = [label, ...dataList];

	return (
		<select
			value={value}
			onChange={onChange}
		>
			{
				options.map((option, i) => {
					let primaryText;
					if (i === 0) {
						primaryText = label;
					} else {
						primaryText = isDataArray ? option : data[option][dataKey];
					}

					return (
						<option
							hidden={i === 0}
							value={option}
							key={i}
						>
							{primaryText}
						</option>
					);
				})
			}
		</select>
	);
};
