import * as React from 'react';
import TextField from 'material-ui/TextField';
import { ValidationErrors } from './validationErrors';

export const TextInput = ({label, value, showErrors, errors, underlineStyle, onChange, onBlur}) => {
	return (
		<div>
			<TextField
				floatingLabelText={label}
				hintText={label}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				underlineStyle={underlineStyle}
			/>
			<ValidationErrors
				showErrors={showErrors}
				errors={errors}
			/>
		</div>
	);
};
