import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';

import { withStyles, WithStyles } from '@material-ui/core/styles';

import { DropdownItemValue, IDropdownOption } from 'types/generic';

import { styles } from './styles';

interface IDropdownProps extends Partial<WithStyles<typeof styles>> {
  options: IDropdownOption[];
  onChange: (value: DropdownItemValue) => void;
  selectedValue?: DropdownItemValue;
  label?: string;
}

function Dropdown(props: IDropdownProps) {
  const { classes, label, onChange, options, selectedValue } = props;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  const renderOption = (option: IDropdownOption) => (
    <MenuItem key={option.value} value={option.value}>
      <Typography color="inherit" variant="body1">
        {option.label}
      </Typography>
    </MenuItem>
  );

  return (
    <FormControl>
      {label ? <InputLabel htmlFor={label}>{label}</InputLabel> : null}
      <Select
        value={selectedValue}
        onChange={handleChange}
        disableUnderline={true}
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

export default withStyles(styles)(Dropdown);
