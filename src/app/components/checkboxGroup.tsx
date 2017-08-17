import * as React from 'react';
import { ValidationErrors } from './validationErrors';
import Checkbox from 'material-ui/Checkbox';
import { FormGroup, FormControlLabel } from 'material-ui/Form';

export const isCheckboxChecked = (checkedList, option) => checkedList.indexOf(option) > -1;

export const getCheckboxOptions = (data, onCheck, checkedList = [], labelKey = 'name') => {

	const isDataArray = data.constructor === Array;
	const options = isDataArray ? data : Object.keys(data);
	return (
		<FormGroup row>
			{
				options.map((option, i) => {
					const label = isDataArray ? option : data[option][labelKey];
					return (
						<FormControlLabel
							key={i}
							control={
								<Checkbox
									onChange={onCheck(option)}
									checked={isCheckboxChecked(checkedList, option)}
								/>
							}
							label={label}
						/>
					);
				})
			}
		</FormGroup>
	);
};

export const CheckboxGroup = ({label, showErrors, errors, options}) => {
	return (
		<div>
			{label}
			<br />
			{options}
			<ValidationErrors
				padding={'0'}
				showErrors={showErrors}
				errors={errors}
			/>
		</div>
	);
};
