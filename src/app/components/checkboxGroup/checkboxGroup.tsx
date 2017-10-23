import * as React from 'react';
import { ValidationErrors } from '../../components';
import { CheckboxOptions, ICheckboxOptionsParams } from './checkboxOptions';
import styled from 'styled-components';

interface ICheckboxGroupParams extends ICheckboxOptionsParams {
  label: string;
  showErrors: boolean;
  errors: string[];
}

const Wrapper = styled.div`
  padding: 10px 0 0;
`;

export function CheckboxGroup({data, label, showErrors, errors, onChange, checkedItems}: ICheckboxGroupParams) {
  return (
    <Wrapper>
      <CheckboxOptions
        data={data}
        onChange={onChange}
        checkedItems={checkedItems}
        label={label}
        hasErrors={showErrors && errors.length > 0}
      />
      <ValidationErrors
        showErrors={showErrors}
        errors={errors}
      />
    </Wrapper>
  );
};
