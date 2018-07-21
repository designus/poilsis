import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { WithStyles } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { IGenericDataMap } from 'client-utils';
import { styles } from './styles';

export interface ICheckboxGroupParams extends WrappedFieldProps, WithStyles<typeof styles> {
  data: IGenericDataMap<object>;
  dataKey: string;
}

class CheckboxGroupComponent extends React.Component<ICheckboxGroupParams> {

  onChange = (value) => (event) => {
    const newValue = this.props.input.value ? [...this.props.input.value] : [];
    if (event.target.checked) {
      newValue.push(value);
    } else {
      newValue.splice(newValue.indexOf(value), 1);
    }
    return this.props.input.onChange(newValue);
  }

  renderCheckbox = (value: string[]) => {
    const { input, classes } = this.props;
    return (
      <Checkbox
        className={classes.checkbox}
        checked={input.value.indexOf(value) !== -1}
        onChange={this.onChange(value)}
      />
    );
  }

  renderOption = (isDataArray: boolean) => (option) => {
    const { data, classes, dataKey } = this.props;
    const checkboxLabel = isDataArray ? option : data[option][dataKey];
    return (
      <FormControlLabel
        key={option}
        classes={{
          root: classes.formControlLabel,
        }}
        control={this.renderCheckbox(option)}
        label={checkboxLabel}
      />
    );
  }

  render() {
    const { data, classes, label, meta } = this.props;
    const showError = Boolean(meta.touched && meta.invalid && meta.error);
    const isDataArray = data.constructor === Array;
    const options: any = isDataArray ? data : Object.keys(data);
    return (
      <div className={classes.wrapper}>
        <Tooltip open={showError} title={meta.error || ''} placement="right-end">
          <FormControl>
            <FormLabel classes={{root: classes.label}} error={showError}>{label}</FormLabel>
            <FormGroup row>
              {
                options.map(this.renderOption(isDataArray))
              }
            </FormGroup>
          </FormControl>
        </Tooltip>
      </div>
  );
  }
}

export const CheckboxGroup = withStyles(styles)(CheckboxGroupComponent) as any;
