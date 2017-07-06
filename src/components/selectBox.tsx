import * as React from 'react';
import { ValidationErrors } from './validationErrors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export const getSelectOptions = (data, labelKey = 'name') => {
		
  const isDataArray = data.constructor === Array; 
  const options = isDataArray ? data : Object.keys(data);

  return options.map((option, i) => {
    const primaryText = isDataArray ? option : data[option][labelKey];
    return (
      <MenuItem 
        value={option}
        key={i}
        primaryText={primaryText}
      />
    )
  })
}

export const SelectBox = ({label, value, underlineStyle, onChange, showErrors, errors, options}) => {

  return (
    <div>
      <SelectField
        floatingLabelText={label}
        value={value}
        onChange={onChange}
        underlineStyle={underlineStyle}
      >
       {options} 
      </SelectField>
      <ValidationErrors 
        showErrors={showErrors}
        errors={errors}
      />
    </div>
  )
}