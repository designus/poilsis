import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { WithStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import { IDropdownOption } from 'client-utils';
import { styles } from './styles';

export interface ISelectboxProps extends WrappedFieldProps, WithStyles<typeof styles> {
  options: IDropdownOption[];
}

const SelectBoxComponent = (props: ISelectboxProps) => {
  const { classes, meta, input, label, options } = props;
  const showError = Boolean(meta.touched && meta.invalid && meta.error);

  return (
    <div className={classes.wrapper}>
      <Tooltip open={showError} title={meta.error || ''} placement="right-end">
        <FormControl className={classes.formControl} error={showError}>
          <InputLabel htmlFor="select">{label}</InputLabel>
          <Select
            value={input.value}
            onChange={input.onChange}
            classes={{ select: classes.select }}
            input={<Input classes={{ root: classes.root }} id="select" />}
          >
            {
              options.map((option: IDropdownOption) => {
                return (
                  <MenuItem
                    value={option.value}
                    key={option.value}
                  >
                    {option.label}
                  </MenuItem>
                );
              })
            }
          </Select>
        </FormControl>
      </Tooltip>
    </div>
  );
};

export const SelectBox = withStyles(styles)(SelectBoxComponent) as any;
