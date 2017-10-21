import * as React from 'react';
import { ValidationErrors } from '../../components';
import { CheckboxOptions, ICheckboxOptionsParams } from './checkboxOptions';

interface ICheckboxGroupParams extends ICheckboxOptionsParams {
  label: string;
  showErrors: boolean;
  errors: string[];
}

export function CheckboxGroup({data, label, showErrors, errors, onChange, checkedItems}: ICheckboxGroupParams) {
  return (
    <div>
      {label}
      <br />
      <CheckboxOptions
        data={data}
        onChange={onChange}
        checkedItems={checkedItems}
      />
      <ValidationErrors
        padding={'0'}
        showErrors={showErrors}
        errors={errors}
      />
    </div>
  );
};
