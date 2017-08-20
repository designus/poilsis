import * as React from 'react';
import { ValidationErrors } from '../../components';
import styled from 'styled-components';

export interface ISelectBoxProps {
	data?: any[];
	dataKey?: string;
	label?: string;
	value?: string;
	onChange?: any;
	showErrors?: boolean;
	errors?: any;
}

export const SelectBoxWrapper = styled.div`
	padding: 10px 0;
`;

export const getSelectOptions = (data, labelKey = 'name') => {

	const isDataArray = data.constructor === Array;
	const options = isDataArray ? data : Object.keys(data);

	return options.map((option, i) => {
		const primaryText = isDataArray ? option : data[option][labelKey];
		return (
			<option
				value={option}
				key={i}
			>
				{primaryText}
			</option>
		);
	});
};

export const SelectBox = ({data, dataKey, label, value, onChange, showErrors, errors}: ISelectBoxProps) => {

	return (
		<SelectBoxWrapper>
			<select
				value={value}
				onChange={onChange}
			>
				<option hidden>{label}</option>
				{getSelectOptions(data, dataKey)} 
			</select>
			<ValidationErrors
				showErrors={showErrors}
				errors={errors}
			/>
		</SelectBoxWrapper>
	);
};
