import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import { styles } from './styles';
import { IGenericDataMap } from 'client-utils';

export interface ISelectboxProps extends WrappedFieldProps, WithStyles<typeof styles> {
  data: IGenericDataMap<object>;
  dataKey: string;
}

const SelectBoxComponent = (props: ISelectboxProps) => {
  const { data, classes, meta, input, label, dataKey } = props;
  const isDataArray = data.constructor === Array;
  const showError = Boolean(meta.touched && meta.invalid && meta.error);
  const options: any = isDataArray ? data : Object.keys(data);

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
      </Tooltip>
    </div>
  );
};

export const SelectBox = withStyles(styles)(SelectBoxComponent) as any;
