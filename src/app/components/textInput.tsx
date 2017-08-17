import * as React from 'react';
import TextField from 'material-ui/TextField';
import { ValidationErrors } from './validationErrors';

export const TextInput = ({label, value, showErrors, errors, onChange, onBlur}) => {
	return (
		<div>
			<TextField
				label={label}
				placeholder={label}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				error={showErrors && errors.length > 0}
				margin="dense"
			/>
			<ValidationErrors
				showErrors={showErrors}
				errors={errors}
			/>
		</div>
	);
};
