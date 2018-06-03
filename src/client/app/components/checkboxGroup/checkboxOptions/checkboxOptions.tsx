import * as React from 'react';
import Checkbox from 'material-ui/Checkbox';
import { FormLabel, FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import { IGenericDataMap } from '../../../client-utils';
import { withStyles } from 'material-ui/styles';

export interface ICheckboxOptionsParams {
  data: any[] | IGenericDataMap<object>;
  onChange: any;
  checkedItems: string[] | number[];
  labelKey?: string;
  label?: string;
  classes?: any;
  hasErrors?: boolean;
}

const styles = theme => ({
  root: {
    width: '100%',
  },
  default: {
    height: '30px',
  },
  label: {
    paddingBottom: '15px',
    fontSize: '13px',
  },
});

export function isCheckboxChecked(checkedItems, option)  {
  return checkedItems.indexOf(option) > -1;
}

function CheckboxOptionsComponent(props: ICheckboxOptionsParams) {

  const {data, onChange, checkedItems = [], labelKey = 'name', label, classes, hasErrors} = props;
  const isDataArray = data.constructor === Array;
  const options: any = isDataArray ? data : Object.keys(data);

  return (
    <FormControl>
      <FormLabel classes={{root: classes.label}} error={hasErrors}>{label}</FormLabel>
      <FormGroup row>
        {
          options.map((option, i) => {
            const checkboxLabel = isDataArray ? option : data[option][labelKey];
            return (
              <FormControlLabel
                key={i}
                classes={{
                  root: classes.root,
                }}
                control={
                  <Checkbox
                    classes={{
                      default: classes.default,
                    }}
                    onChange={onChange(option)}
                    checked={isCheckboxChecked(checkedItems, option)}
                  />
                }
                label={checkboxLabel}
              />
            );
          })
        }
      </FormGroup>
    </FormControl>
  );
}

export const CheckboxOptions = withStyles(styles)<ICheckboxOptionsParams>(CheckboxOptionsComponent);
