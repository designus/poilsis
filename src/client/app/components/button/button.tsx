import * as React from 'react';
import ActionButton from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { withStyles, createStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { voidFn } from 'global-utils';

export const defaultStyles = (theme: Theme) => createStyles({
  root: {
    borderRadius: '20px',
    minWidth: '120px',
    margin: '10px 0',
    padding: '6px 15px',
  },
  label: {
    '& > svg': {
      width: '20px',
      height: '20px',
      margin: '0 2px 0 0',
    },
  },
});

export interface IButtonProps {
  onClick?: (e) => void;
  children?: any;
  type?: 'submit' | 'button';
  color?: any;
  classes?: any;
  style?: object;
  disabled?: boolean;
}

export const ButtonComponent = ({
  onClick = voidFn,
  children,
  classes,
  color = 'primary',
  type = 'button',
  disabled = false,
}: IButtonProps) => {
  return (
    <ActionButton
      classes={{
        root: classes.root,
        label: classes.label,
      }}
      disabled={disabled}
      onClick={onClick}
      color={color}
      variant="contained"
      type={type}
    >
      {children}
    </ActionButton>
  );
};

export const Button = withStyles(defaultStyles)(ButtonComponent);
