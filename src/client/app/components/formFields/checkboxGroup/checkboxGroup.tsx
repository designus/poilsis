import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { IDropdownOption } from 'types/generic';
import { styles } from './styles';

export interface ICheckboxGroupParams extends WrappedFieldProps, WithStyles<typeof styles> {
  options: IDropdownOption[];
  isHidden: boolean;
}

class CheckboxGroupComponent extends React.Component<ICheckboxGroupParams> {

  onChange = (value: any) => (event: any) => {
    const newValue = this.props.input.value ? [...this.props.input.value] : [];
    if (event.target.checked) {
      newValue.push(value);
    } else {
      newValue.splice(newValue.indexOf(value), 1);
    }
    return this.props.input.onChange(newValue);
  }

  renderCheckbox = (option: IDropdownOption) => {
    const { input, classes } = this.props;
    return (
      <Checkbox
        className={classes.checkbox}
        checked={input.value.indexOf(option.value) !== -1}
        onChange={this.onChange(option.value)}
      />
    );
  }

  renderOption = (option: IDropdownOption) => {
    return (
      <FormControlLabel
        key={option.value}
        classes={{
          root: this.props.classes.formControlLabel
        }}
        control={this.renderCheckbox(option)}
        label={option.label}
      />
    );
  }

  render() {
    const { classes, label, meta, options, isHidden } = this.props;
    const showError = Boolean(meta.touched && meta.invalid && meta.error);

    return (
      <div className={`${classes.wrapper} ${isHidden ? classes.hidden : ''}`}>
        <Tooltip open={showError} title={meta.error || ''} placement="right-end">
          <FormControl>
            <FormLabel classes={{root: classes.label}} error={showError}>{label}</FormLabel>
            <FormGroup row>
              {
                options.map(this.renderOption)
              }
            </FormGroup>
          </FormControl>
        </Tooltip>
      </div>
  );
  }
}

export const CheckboxGroup = withStyles(styles)(CheckboxGroupComponent) as any;
