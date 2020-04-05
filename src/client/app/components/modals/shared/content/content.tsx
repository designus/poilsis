import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import DialogContentBox from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { extendWithLoader } from 'components/extendWithLoader';
import { styles } from '../../styles';

type Props = WithStyles<typeof styles> & {
  error?: string;
};

const Content: React.FunctionComponent<Props> = (props) => (
  <DialogContentBox className={props.classes.content}>
    {props.error ? (<DialogContentText>{props.error}</DialogContentText>) : props.children}
  </DialogContentBox>
);

export default extendWithLoader(
  withStyles(styles)(Content)
);
