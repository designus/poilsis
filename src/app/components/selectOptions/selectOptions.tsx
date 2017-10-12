import * as React from 'react';
import { IGenericDataMap } from '../../helpers';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';

export interface ISelectOptionProps {
  data?: any[]|IGenericDataMap<object>;
  dataKey?: string;
  label?: string;
  value?: string;
  onChange?: any;
  classes?: any;
}

const styles = theme => ({
  select: {
    minWidth: 120,
  },
});

function SelectField({data, label = 'select', dataKey = 'name', value, onChange, classes}: ISelectOptionProps) {

  const isDataArray = data.constructor === Array;
  const dataList: any = isDataArray ? data : Object.keys(data);
  const options = [...dataList];

  return (
    <FormControl>
      <InputLabel htmlFor="select">{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        input={<Input id="select" />}
        className={classes.select}
      >
        <MenuItem value="">
          None
        </MenuItem>
        {
          options.map((option, i) => {
            let primaryText;
            if (i === 0) {
              primaryText = label;
            } else {
              primaryText = isDataArray ? option : data[option][dataKey];
            }

            return (
              <MenuItem
                value={option}
                key={i}
              >
                {primaryText}
              </MenuItem>
            );
          })
        }
      </Select>
    </FormControl>
  );
};

export const SelectOptions = withStyles(styles)(SelectField);
