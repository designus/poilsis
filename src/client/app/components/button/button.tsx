import * as React from 'react';
import ActionButton from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { voidFn } from '../../client-utils';

const styles = theme => ({
  root: {
    borderRadius: '20px',
    minWidth: '120px',
    margin: '20px 0',
  },
});

export interface IButtonProps {
  onClick?: () => void;
  children?: any;
  type?: 'submit'|'button';
  color?: 'default'|'primary';
  classes?: any;
}

export const ButtonComponent = ({onClick = voidFn, children, classes, type = 'submit', color = 'primary'}: IButtonProps) => {
  return (
    <ActionButton
      classes={{
        root: classes.root,
      }}
      onClick={onClick}
      raised
      color={color}
      type={type}
    >
      {children}
    </ActionButton>
  );
};

export const Button = withStyles(styles)(ButtonComponent);
