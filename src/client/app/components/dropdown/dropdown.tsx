import React, { useEffect, useState, useRef } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';

import { DropdownItemValue, IDropdownOption } from 'types/generic';

import { useStyles } from './styles';

export type Props = {
  options: IDropdownOption[];
  onChange: (value: DropdownItemValue) => void;
  selectedValue?: DropdownItemValue;
  isOutlined?: boolean;
  label?: string;
  minWidth?: number;
  disableUnderline: boolean;
};

Dropdown.defaultProps = {
  disableUnderline: true
} as Partial<Props>;

function Dropdown(props: Props) {
  const { label, onChange, options, selectedValue } = props;
  const classes = useStyles(props);

  const handleChange: SelectInputProps['onChange'] = (event) => {
    if (onChange) {
      onChange(event.target.value as DropdownItemValue);
    }
  };

  const renderOption = (option: IDropdownOption) => (
    <MenuItem key={option.value} value={option.value}>
      {/* <Typography color="inherit" variant="body2">
        {option.label}
      </Typography> */}
      {option.label}
    </MenuItem>
  );

  return (
    <FormControl className={classes.wrapper}>
      {label ? <InputLabel htmlFor={label}>{label}</InputLabel> : null}
      <Select
        value={selectedValue}
        onChange={handleChange}
        disableUnderline={props.disableUnderline}
        inputProps={{
          id: label
        }}
        classes={{
          root: classes.root,
          icon: classes.icon
        }}
      >
        {options.map(renderOption)}
      </Select>
    </FormControl>
  );
}

export default Dropdown;
