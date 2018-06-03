import * as React from 'react';
import styled from 'styled-components';
import { ValidationErrors } from '../../components';
import { SelectOptions, ISelectOptionProps } from './selectOptions';

export interface ISelectBoxProps extends ISelectOptionProps {
  showErrors?: boolean;
  errors?: any;
}

const Wrapper = styled.div`
  padding: 10px 0;
`;

export function SelectBox({data, dataKey, label, value, onChange, showErrors, errors}: ISelectBoxProps) {
  return (
    <Wrapper>
      <SelectOptions
        data={data}
        label={label}
        dataKey={dataKey}
        value={value}
        onChange={onChange}
        hasErrors={showErrors && errors.length > 0}
      />
      <ValidationErrors
        showErrors={showErrors}
        errors={errors}
      />
    </Wrapper>
  );
}
