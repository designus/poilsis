import * as React from 'react';
import ActionButton from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { PropTypes } from 'material-ui';
import { voidFn } from '../../client-utils';

const defaultStyles = theme => ({
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
  onClick?: () => void;
  children?: any;
  type?: 'submit' | 'button';
  color?: PropTypes.Color;
  classes?: any;
  style?: object;
}

export const ButtonComponent = ({
  onClick = voidFn,
  children,
  classes,
  style = {},
  type = 'submit',
  color = 'primary',
}: IButtonProps) => {
  return (
    <ActionButton
      classes={{
        root: classes.root,
        label: classes.label,
      }}
      onClick={onClick}
      raised
      color={color}
      type={type}
      style={style}
    >
      {children}
    </ActionButton>
  );
};

export const Button = withStyles(defaultStyles)(ButtonComponent);
