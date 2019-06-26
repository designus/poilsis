import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

import { withStyles, WithStyles } from '@material-ui/core/styles';

import { DropdownItemValue, IDropdownOption } from 'client-utils';

import { styles } from './styles';

interface IDropdownProps extends Partial<WithStyles<typeof styles>> {
  selectedValue: DropdownItemValue;
  options: IDropdownOption[];
  onChange: (value: DropdownItemValue) => void;
}

class Dropdown extends React.Component<IDropdownProps> {

  onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.onChange(event.target.value);
  }

  renderOption = (option: IDropdownOption) => (
    <MenuItem key={option.value} value={option.value}>
      <Typography color="inherit" variant="body1">
        {option.label}
      </Typography>
    </MenuItem>
  )

  render() {
    const { classes } = this.props;
    return (
      <Select
        value={this.props.selectedValue}
        onChange={this.onChange}
        disableUnderline={true}
        classes={{
          root: classes.root,
          icon: classes.icon
        }}
      >
        {this.props.options.map(this.renderOption)}
      </Select>
    );
  }
}

export default withStyles(styles)(Dropdown);
