import * as React from 'react';
import MaterialButton, { ButtonProps } from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    borderRadius: (props: IButtonProps) => `${props.borderRadius ? props.borderRadius : 20}px`,
    minWidth: '120px',
    margin: '10px 5px 0 0',
    padding: '6px 15px'
  },
  label: {
    '& > svg': {
      width: '20px',
      height: '20px',
      margin: '0 2px 0 0'
    }
  }
});

export interface IButtonProps extends ButtonProps {
  borderRadius?: number;
}

export const Button: React.FunctionComponent<IButtonProps> = props => {
  const classes = useStyles(props);

  return (
    <MaterialButton
      classes={{
        root: classes.root,
        label: classes.label
      }}
      disabled={props.disabled}
      onClick={props.onClick}
      color={props.color || 'primary'}
      variant={props.variant || 'contained'}
      type={props.type || 'button'}
    >
      {props.children}
    </MaterialButton>
  );
};
