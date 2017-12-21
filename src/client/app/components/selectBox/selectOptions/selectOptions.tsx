import * as React from 'react';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import { withStyles } from 'material-ui/styles';
import { IGenericDataMap } from '../../../client-utils';
import { INPUT_WIDTH, INPUT_STYLE_MIXIN } from '../../../global-styles';

export interface ISelectOptionProps {
  data?: any[]|IGenericDataMap<object>;
  dataKey?: string;
  label?: string;
  value?: string;
  onChange?: any;
  classes?: any;
  hasErrors?: boolean;
}

const styles = theme => ({
  formControl: {
    minWidth: INPUT_WIDTH,
  },
  root: {
    paddingBottom: '1px',
  },
  select: {
    '&:focus': {
      background: 'none',
    },
  },
  ...INPUT_STYLE_MIXIN,
});

function SelectField({data, label = 'select', dataKey = 'name', value, onChange, classes, hasErrors}: ISelectOptionProps) {
  const isDataArray = data.constructor === Array;
  const dataList: any = isDataArray ? data : Object.keys(data);
  const options = [...dataList];

  return (
    <FormControl className={classes.formControl} error={hasErrors}>
      <InputLabel htmlFor="select">{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        classes={{
          select: classes.select,
        }}
        input={<Input classes={{
          root: classes.root,
          underline: classes.underline,
          focused: classes.focused,
        }} id="select" />}
      >
        {
          options.map((option, i) => {
            const primaryText = isDataArray ? option : data[option][dataKey];
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
