import * as React from 'react';
import { ValidationErrors } from './validationErrors';
import styled from 'styled-components';

export const SelectBoxWrapper = styled.div`
	padding: 10px 0;
`;

export const getSelectOptions = (data, labelKey = 'name') => {

	const isDataArray = data.constructor === Array;
	const options = isDataArray ? data : Object.keys(data);

	return options.map((option, i) => {
		const primaryText = isDataArray ? option : data[option][labelKey];
		return (
			<option	value={option} key={i}>
				{primaryText}
			</option>
		);
	});
};

export const SelectBox = ({label, value, onChange, showErrors, errors, options}) => {

	return (
		<SelectBoxWrapper>
			<select
				value={value}
				onChange={onChange}
			>
				<option hidden>{label}</option>
				{options} 
			</select>
			<ValidationErrors
				showErrors={showErrors}
				errors={errors}
			/>
		</SelectBoxWrapper>
	);
};
