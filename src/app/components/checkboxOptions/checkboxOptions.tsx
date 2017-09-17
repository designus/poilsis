import * as React from 'react';
import Checkbox from 'material-ui/Checkbox';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import { IGenericDataMap } from '../../helpers';

export interface ICheckboxOptionsParams {
  data: any[]|IGenericDataMap<object>;
  onChange: any;
  checkedItems: string[]|number[];
  labelKey?: string;
}

export function isCheckboxChecked(checkedItems, option)  {
  return checkedItems.indexOf(option) > -1;
}

export function CheckboxOptions({data, onChange, checkedItems = [], labelKey = 'name'}: ICheckboxOptionsParams) {

  const isDataArray = data.constructor === Array;
  const options: any = isDataArray ? data : Object.keys(data);

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
                  onChange={onChange(option)}
                  checked={isCheckboxChecked(checkedItems, option)}
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
