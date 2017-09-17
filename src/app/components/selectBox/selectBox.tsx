import * as React from 'react';
import styled from 'styled-components';
import { ValidationErrors, SelectOptions, ISelectOptionProps } from '../../components';

export interface ISelectBoxProps extends ISelectOptionProps {
  showErrors?: boolean;
  errors?: any;
}

export const SelectBoxWrapper = styled.div`
  padding: 10px 0;
`;

export function SelectBox({data, dataKey, label, value, onChange, showErrors, errors}: ISelectBoxProps) {

  return (
    <SelectBoxWrapper>
      <SelectOptions
        data={data}
        label={label}
        dataKey={dataKey}
        value={value}
        onChange={onChange}
      />
      <ValidationErrors
        showErrors={showErrors}
        errors={errors}
      />
    </SelectBoxWrapper>
  );
};
