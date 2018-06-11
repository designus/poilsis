import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { IGenericDataMap } from '../../../client-utils';

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
