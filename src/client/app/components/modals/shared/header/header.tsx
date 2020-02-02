import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { styles } from '../../styles';

type Props = WithStyles<typeof styles> & {
  children: JSX.Element | JSX.Element[];
  onClose: () => void;
};

const Header = (props: Props) => (
  <DialogTitle disableTypography className={props.classes.header}>
    <Typography variant="h3" color="inherit" noWrap>
      {props.children}
    </Typography>
    <IconButton
      aria-label="Close modal"
      className={props.classes.closeButton}
      onClick={props.onClose}
    >
      <ClearIcon />
    </IconButton>
  </DialogTitle>
);

export default withStyles(styles)(Header);
