import React from 'react';
import { ValidationErrors } from './validationErrors';
import Checkbox from 'material-ui/Checkbox';

export const isCheckboxChecked = (checkedList, option) => checkedList.indexOf(option) > -1;

export const getCheckboxOptions = (data, onCheck, checkedList = [], labelKey = 'name') => {
  
  const isDataArray = data.constructor === Array; 
  const options = isDataArray ? data : Object.keys(data); 

  return options.map((option, i) => {
    const label = isDataArray ? option : data[option][labelKey];
    return (
      <div key={i}>
        <Checkbox
          label={label}
          onCheck={onCheck(option)}
          checked={isCheckboxChecked(checkedList, option)}
        />
      </div>
    )

  })
}

export const CheckboxGroup = ({label, showErrors, errors, options}) => {
  return (
    <div>
      <br />
      {label}
      <br />
      {options}
      <br />
      <ValidationErrors 
        showErrors={showErrors}
        errors={errors}
      />
    </div>
  )
}